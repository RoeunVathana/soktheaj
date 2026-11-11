<?php

namespace App\Services\Contracts;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

interface SocialServiceInterface extends BaseServiceInterface
{
    public function all(): Collection;

    public function visible(): JsonResponse;
}