<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

interface MessageServiceInterface extends BaseServiceInterface
{
    public function index(Request $request): JsonResponse;

    public function markAsRead($message): JsonResponse;

    public function reply($message, array $data): JsonResponse;
}