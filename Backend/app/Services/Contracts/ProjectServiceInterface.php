<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

interface ProjectServiceInterface extends BaseServiceInterface
{
    public function index(Request $request): JsonResponse;

    public function showBySlug(string $slug): JsonResponse;

    public function featured(): JsonResponse;
}