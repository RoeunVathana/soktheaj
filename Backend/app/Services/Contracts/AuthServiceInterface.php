<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;

interface AuthServiceInterface
{
    public function register(array $data): JsonResponse;

    public function login(array $data): JsonResponse;

    public function logout($user): JsonResponse;

    public function user($user): JsonResponse;

    public function refreshToken(string $refreshToken): JsonResponse;

    public function generateTwoFactorSecret($user): JsonResponse;

    public function enableTwoFactor($user, array $data): JsonResponse;

    public function verifyTwoFactor(array $data): JsonResponse;

    public function verifyOtp(array $data): JsonResponse;

    public function updateProfile($user, array $data): JsonResponse;

    public function destroyProfile($user): JsonResponse;
}
