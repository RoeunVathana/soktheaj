<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PasswordResetToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $email = $request->email;
        $token = Str::random(60);

        PasswordResetToken::query()->updateOrCreate(
            ['email' => $email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        return response()->json([
            'success' => true,
            'message' => 'Password reset link has been sent to your email.',
            'data' => [
                'token' => $token,
            ],
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = PasswordResetToken::query()
            ->where('email', $request->email)
            ->first();

        if (! $record || ! Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        $record->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset successfully.',
        ]);
    }
}
