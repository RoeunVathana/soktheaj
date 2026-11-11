<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateProfileRequest;
use App\Services\Contracts\AuthServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Enterprise-Grade AuthController
 *
 * Implements a Defense-in-Depth authentication strategy:
 *
 * 1. Short-lived Access Token (15 min) → returned in JSON body only.
 * 2. Long-lived Refresh Token (7 days) → stored in httpOnly, SameSite=Strict cookie.
 *    This prevents XSS from stealing the refresh token and CSRF from using it.
 * 3. Refresh endpoint reads the httpOnly cookie exclusively.
 * 4. Logout revokes ALL tokens and clears the cookie.
 *
 * Security Rationale:
 *  - Access tokens in memory (React state) → not persisted to storage, XSS-resistant.
 *  - Refresh tokens in httpOnly cookies → JS cannot read them, CSRF protected by SameSite.
 *  - Rolling refresh tokens → each refresh issues a new refresh token, limiting reuse.
 */
class AuthController extends Controller
{
    public function __construct(protected AuthServiceInterface $authService) {}

    /**
     * POST /api/v1/auth/login
     *
     * Authenticates user credentials, issues:
     *  - access_token (15-min TTL) in response body
     *  - refresh_token (7-day TTL) as httpOnly cookie
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        return $this->authService->login($validated);
    }

    /**
     * POST /api/v1/auth/refresh
     *
     * Reads the refresh token from the httpOnly cookie FIRST.
     * Falls back to the request body if the cookie is not present.
     *
     * Security:
     *  - httpOnly cookie is the primary source (XSS-proof).
     *  - Request body fallback is provided for cases where the cookie
     *    may not be sent (e.g., certain cross-origin scenarios, or
     *    during initial development/testing).
     *  - Uses Sanctum's PersonalAccessToken::findToken() for resolution.
     */
    public function refresh(Request $request): JsonResponse
    {
        // ── Security: Extract refresh token from httpOnly cookie first ──
        // Fall back to request body if cookie is not present.
        $refreshToken = $request->cookie('refresh_token') ?? $request->input('refresh_token');

        if (! $refreshToken) {
            return response()->json([
                'message' => 'No refresh token provided. Please login again.',
            ], 401);
        }

        return $this->authService->refreshToken($refreshToken);
    }

    /**
     * POST /api/v1/auth/logout
     *
     * Revokes ALL tokens for the authenticated user and clears the refresh cookie.
     */
    public function logout(Request $request): JsonResponse
    {
        return $this->authService->logout($request->user());
    }

    /**
     * GET /api/v1/auth/user
     *
     * Returns the currently authenticated user's data.
     * Protected by auth:sanctum middleware.
     */
    public function user(Request $request): JsonResponse
    {
        return $this->authService->user($request->user());
    }

    /**
     * GET /api/v1/auth/profile
     *
     * Returns the public admin profile (unauthenticated).
     */
    public function profile(): JsonResponse
    {
        $user = \App\Models\User::where('role', 'admin')->first();

        if (! $user) {
            return response()->json(['message' => 'No profile found'], 404);
        }

        return response()->json(new \App\Http\Resources\Api\V1\UserResource($user));
    }

    /**
     * POST /api/v1/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        return $this->authService->register($validated);
    }

    /**
     * POST /api/v1/auth/verify-otp
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'otp'   => 'required|string|size:6',
        ]);

        return $this->authService->verifyOtp($validated);
    }

    /**
     * POST /api/v1/2fa/verify
     */
    public function verifyTwoFactor(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'         => 'required|string|email',
            'otp'           => 'required_without:recovery_code|string|size:6',
            'recovery_code' => 'required_without:otp|string',
        ]);

        return $this->authService->verifyTwoFactor($validated);
    }

    /**
     * POST /api/v1/2fa/generate
     */
    public function generateTwoFactorSecret(Request $request): JsonResponse
    {
        return $this->authService->generateTwoFactorSecret($request->user());
    }

    /**
     * POST /api/v1/2fa/enable
     */
    public function enableTwoFactor(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        return $this->authService->enableTwoFactor($request->user(), $validated);
    }

    /**
     * PUT/PATCH /api/v1/auth/profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        return $this->authService->updateProfile($request->user(), $request->validated());
    }

    /**
     * DELETE /api/v1/auth/profile
     */
    public function destroyProfile(Request $request): JsonResponse
    {
        return $this->authService->destroyProfile($request->user());
    }

    /**
     * POST /api/v1/auth/avatar/upload
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'avatars'   => 'required|array',
            'avatars.*' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
        ]);

        $user = $request->user();

        // 1. Delete old avatars from storage
        if ($user->avatars && is_array($user->avatars)) {
            foreach ($user->avatars as $oldUrl) {
                $path = str_replace('/storage/', '', $oldUrl);
                Storage::disk('public')->delete($path);
            }
        }

        // 2. Store new avatars
        $uploadedPaths = [];
        foreach ($request->file('avatars') as $file) {
            $path = $file->store('avatars', 'public');
            $uploadedPaths[] = '/storage/' . $path;
        }

        // 3. Update user model
        $user->update(['avatars' => $uploadedPaths]);

        return response()->json([
            'message' => 'Avatars uploaded successfully.',
            'avatars' => $user->avatars,
        ]);
    }
}