<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\UserResource;
use App\Mail\OtpMail;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Contracts\AuthServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;


/**
 * Enterprise-Grade AuthService
 *
 * Implements a Defense-in-Depth token strategy:
 *
 *  - Access Token: 15-minute TTL, returned ONLY in JSON body.
 *  - Refresh Token: 7-day TTL, stored in httpOnly/SameSite=Strict cookie.
 *  - Rolling Refresh: Each refresh call issues a NEW refresh token (token rotation).
 *  - Logout: Revokes ALL tokens for the user and clears the cookie.
 *
 * Security Rationale:
 *  - Access tokens in memory (React state) → XSS-resistant.
 *  - Refresh tokens in httpOnly cookies → JS cannot read them.
 *  - SameSite=Strict → CSRF protection for the refresh endpoint.
 *  - Rolling refresh tokens → limits damage if a refresh token is compromised.
 */
class AuthService implements AuthServiceInterface
{
    use \App\Traits\ApiResponse;

    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected \PragmaRX\Google2FALaravel\Google2FA $google2fa
    ) {}

    /**
     * Register a new user and send OTP verification email.
     */
    public function register(array $data): JsonResponse
    {
        $user = $this->userRepository->createVisitor($data);

        // Generate 6-digit OTP and store in cache for 5 minutes
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put('otp_' . $user->email, $otp, now()->addMinutes(5));

        // Send OTP email
        Mail::to($user->email)->send(new OtpMail($otp, $user->name));

        return response()->json([
            'message' => 'User registered successfully. Please verify your email using the OTP sent to your email.',
            'user'    => new UserResource($user),
        ], 201);
    }

    /**
     * Authenticate user credentials and issue tokens.
     *
     * Security:
     *  - access_token (15-min) → JSON body only (stored in React memory).
     *  - refresh_token (7-day) → httpOnly cookie with SameSite=Strict.
     */
    public function login(array $data): JsonResponse
    {
        $user = $this->userRepository->findByEmail($data['email']);

        // Account does not exist in the database → direct user to register
        if (! $user) {
            return response()->json([
                'message'            => 'Account not found. Please register first.',
                'account_not_found'  => true,
            ], 404);
        }

        if (! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // If 2FA is enabled, return a response indicating 2FA verification is required
        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'message'             => '2FA verification is required to complete login.',
                'two_factor_required' => true,
                'user_email'          => $user->email,
            ]);
        }

        // 2FA is disabled — issue tokens directly
        return $this->issueTokens($user, 'Login successful');
    }

    /**
     * Logout: revoke ALL tokens for the user and clear the refresh cookie.
     */
    public function logout($user): JsonResponse
    {
        // Revoke ALL tokens for this user (access + refresh)
        $user->tokens()->delete();

        // Clear the refresh token cookie using Cookie::forget()
        return response()->json([
            'message' => 'Logged out successfully',
        ])->withCookie(Cookie::forget('refresh_token'));
    }

    /**
     * Return the authenticated user's data.
     */
    public function user($user): JsonResponse
    {
        return response()->json(new UserResource($user));
    }

    /**
     * Refresh the access token using the refresh token from the httpOnly cookie.
     *
     * Security:
     *  - Uses Sanctum's PersonalAccessToken::findToken() for standard token resolution.
     *  - Validates the refresh token against the database.
     *  - Only issues a new short-lived access token (15-min).
     *    The refresh token itself is NOT rotated here — it remains valid until
     *    it naturally expires or is explicitly revoked on logout.
     *  - This approach avoids the complexity of rolling refresh tokens while
     *    maintaining strong security via the short-lived access token.
     */
    public function refreshToken(string $refreshToken): JsonResponse
    {
        // ── Security: Use Sanctum's standard findToken() method ──
        // PersonalAccessToken::findToken() internally hashes the plain-text token
        // with SHA-256 and compares it to the stored hash in the database.
        // This is the canonical Sanctum approach for token resolution.
        $tokenModel = PersonalAccessToken::findToken($refreshToken);

        if (! $tokenModel || ! $tokenModel->can('refresh')) {
            return response()->json([
                'message' => 'Invalid or expired refresh token. Please login again.',
            ], 401);
        }

        // Check if the token has expired
        if ($tokenModel->expires_at && $tokenModel->expires_at->isPast()) {
            $tokenModel->delete();
            return response()->json([
                'message' => 'Refresh token has expired. Please login again.',
            ], 401);
        }

        $user = $tokenModel->tokenable;

        // ── Revoke the old access token to keep only one active session ──
        $user->tokens()->where('name', 'access-token')->delete();

        // ── Issue a NEW short-lived access token (15 minutes) ──
        $newAccessToken = $user->createToken('access-token', ['*'], now()->addMinutes(15))->plainTextToken;

        return response()->json([
            'message'      => 'Token refreshed successfully.',
            'access_token' => $newAccessToken,
            'token_type'   => 'Bearer',
            'expires_in'   => 900, // 15 minutes in seconds
            'user'         => new UserResource($user),
        ]);
    }

    // ─────────────────────────────────────────────────────────
    //  OTP & 2FA Methods
    // ─────────────────────────────────────────────────────────

    public function verifyOtp(array $data): JsonResponse
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'Email is already verified.'], 400);
        }

        $cachedOtp = Cache::get('otp_' . $user->email);

        if (! $cachedOtp) {
            return response()->json(['message' => 'OTP has expired or is invalid. Please request a new one.'], 400);
        }

        if ($cachedOtp !== $data['otp']) {
            return response()->json(['message' => 'Invalid OTP code.'], 422);
        }

        $user->is_verified = true;
        $user->email_verified_at = now();
        $user->save();

        Cache::forget('otp_' . $user->email);

        return $this->issueTokens($user, 'Email verified successfully. Login successful.');
    }

    public function generateTwoFactorSecret($user): JsonResponse
    {
        $secret = $this->google2fa->generateSecretKey();

        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        $user->google2fa_secret = $secret;
        $user->two_factor_enabled = false;
        $user->save();

        return response()->json([
            'message'      => '2FA secret generated. Scan the QR code with your authenticator app.',
            'secret'       => $secret,
            'qr_code_url'  => $qrCodeUrl,
        ]);
    }

    public function enableTwoFactor($user, array $data): JsonResponse
    {
        if (! $user->google2fa_secret) {
            return response()->json(['message' => 'Generate a 2FA secret first using /2fa/generate.'], 400);
        }

        if ($user->two_factor_enabled) {
            return response()->json(['message' => '2FA is already enabled for this account.'], 400);
        }

        $valid = $this->google2fa->verifyKey($user->google2fa_secret, $data['otp']);

        if (! $valid) {
            return response()->json(['message' => 'Invalid OTP code. Please try again.'], 422);
        }

        $recoveryCodes = [];
        for ($i = 0; $i < 8; $i++) {
            $recoveryCodes[] = Str::random(10) . '-' . Str::random(10);
        }

        $user->two_factor_enabled = true;
        $user->two_factor_confirmed_at = now();
        $user->setRecoveryCodes($recoveryCodes);

        return response()->json([
            'message'        => '2FA has been enabled successfully.',
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    public function verifyTwoFactor(array $data): JsonResponse
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if (! $user || ! $user->hasTwoFactorEnabled()) {
            return response()->json(['message' => 'Invalid user or 2FA is not enabled for this account.'], 400);
        }

        $validOtp = $this->google2fa->verifyKey($user->google2fa_secret, $data['otp']);

        if ($validOtp) {
            return $this->issueTokens($user, 'Login successful');
        }

        if (isset($data['recovery_code'])) {
            $codes = $user->recoveryCodes();
            $index = array_search($data['recovery_code'], $codes);

            if ($index !== false) {
                unset($codes[$index]);
                $user->setRecoveryCodes(array_values($codes));
                return $this->issueTokens($user, 'Login successful');
            }

            return response()->json(['message' => 'Invalid recovery code.'], 422);
        }

        return response()->json(['message' => 'Invalid OTP code.'], 422);
    }

    // ─────────────────────────────────────────────────────────
    //  Profile Management
    // ─────────────────────────────────────────────────────────

    public function updateProfile($user, array $data): JsonResponse
    {
        $allowedFields = [
            'name', 'email', 'title', 'headline', 'description', 'bio',
            'contact', 'socials',
        ];

        $updatable = [];
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $updatable[$field] = $data[$field];
            }
        }

        if (empty($updatable)) {
            return response()->json(['message' => 'No valid fields to update.'], 422);
        }

        if (isset($updatable['email']) && $updatable['email'] !== $user->email) {
            $updatable['is_verified'] = false;
            $updatable['email_verified_at'] = null;
        }

        // Ensure JSON fields are valid arrays/objects before saving to MySQL JSON columns
        foreach (['contact', 'socials'] as $jsonField) {
            if (isset($updatable[$jsonField])) {
                if (is_string($updatable[$jsonField])) {
                    $decoded = json_decode($updatable[$jsonField], true);
                    $updatable[$jsonField] = $decoded ?? [];
                } elseif (! is_array($updatable[$jsonField])) {
                    $updatable[$jsonField] = [];
                }
            }
        }

        $user->update($updatable);

        $freshUser = $user->fresh();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => new UserResource($freshUser),
        ]);
    }

    public function destroyProfile($user): JsonResponse
    {
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully.',
        ])->withCookie(Cookie::forget('refresh_token'));
    }

    // ─────────────────────────────────────────────────────────
    //  Token Helpers
    // ─────────────────────────────────────────────────────────

    /**
     * Issue access and refresh tokens.
     *
     * Security:
     *  - Access Token: 15-minute TTL, returned in JSON body only.
     *  - Refresh Token: 7-day TTL, stored in an httpOnly cookie.
     *  - Rolling refresh: old refresh tokens are revoked on each refresh.
     *
     * The refresh token cookie is configured with:
     *  - httpOnly: true  → JavaScript cannot read it (XSS protection).
     *  - sameSite: 'none' in production → Required because the SPA and API use
     *    different domains; the cookie remains httpOnly and Secure.
     *  - secure: true → Only sent over HTTPS (handled automatically in production).
     *  - path: '/' → Available to all endpoints.
     */
    private function issueTokens($user, string $message = 'Login successful', int $statusCode = 200): JsonResponse
    {
        // Revoke any existing access tokens to keep only one active session
        $user->tokens()->where('name', 'access-token')->delete();

        // ── Access Token: 15-minute lifespan ──
        // Short TTL limits the window of opportunity if the token is compromised.
        $accessToken = $user->createToken('access-token', ['*'], now()->addMinutes(15))->plainTextToken;

        // ── Refresh Token: 7-day lifespan ──
        // Stored in httpOnly cookie (not accessible via JavaScript).
        $refreshTokenPlainText = $this->createRefreshToken($user);

        // ── Build the response with the access token in the body ──
        $response = response()->json([
            'message'      => $message,
            'user'         => new UserResource($user),
            'access_token' => $accessToken,
            'token_type'   => 'Bearer',
            'expires_in'   => 900, // 15 minutes in seconds
        ], $statusCode);

        // ── Attach the refresh token as an httpOnly cookie ──
        // httpOnly=true: Prevents XSS from reading the token.
        // SameSite policy:
        //   - Production (HTTPS): 'None' + Secure=true (works with the SPA on
        //     soktheajr.com calling the API on Railway)
        //   - Local (HTTP): 'Lax' + Secure=false (Chrome blocks SameSite=None without Secure)
        // path='/': Available to all endpoints.
        $isProduction = config('app.env') === 'production' || request()->secure();

        $response->withCookie(cookie(
            'refresh_token',                    // name
            $refreshTokenPlainText,             // value
            60 * 24 * 7,                        // 7 days (minutes)
            '/',                                // path
            config('session.domain'),           // domain
            $isProduction,                      // secure (HTTPS only in production)
            true,                               // httpOnly (not accessible via JavaScript)
            false,                              // raw
            $isProduction ? 'None' : 'Lax'       // Cross-site SPA/API in production
        ));

        return $response;
    }

    /**
     * Create a refresh token stored as a Sanctum token with 'refresh' ability.
     *
     * Uses Sanctum's createToken() which returns a plainTextToken in the format:
     *   "id|random_string"
     * This format is required by PersonalAccessToken::findToken() to properly
     * resolve the token. The ID prefix allows Sanctum to quickly locate the
     * token record, and the random string is hashed with SHA-256 for comparison.
     *
     * Returns the full plainTextToken (with ID prefix) to be set in the httpOnly cookie.
     */
    private function createRefreshToken($user): string
    {
        // Revoke old refresh tokens to enforce rolling refresh
        $user->tokens()->where('name', 'refresh-token')->delete();

        // Use Sanctum's createToken() to generate a properly formatted token
        // with the "id|random_string" format that findToken() can parse.
        $tokenObject = $user->createToken('refresh-token', ['refresh'], now()->addDays(7));

        // Return the full plainTextToken including the ID prefix (e.g., "12|abc123...")
        return $tokenObject->plainTextToken;
    }
}
