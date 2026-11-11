<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;

interface BaseServiceInterface
{
    public function store(array $data): JsonResponse;

    public function show($model): JsonResponse;

    public function update($model, array $data): JsonResponse;

    public function destroy($model): JsonResponse;
}