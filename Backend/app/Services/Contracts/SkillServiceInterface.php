<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

interface SkillServiceInterface extends BaseServiceInterface
{
    public function index(Request $request): JsonResponse;
}