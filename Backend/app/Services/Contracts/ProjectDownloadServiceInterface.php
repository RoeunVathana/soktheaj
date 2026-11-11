<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

interface ProjectDownloadServiceInterface extends BaseServiceInterface
{
    public function index(): JsonResponse;

    public function store(Request $request, $project): JsonResponse;
}