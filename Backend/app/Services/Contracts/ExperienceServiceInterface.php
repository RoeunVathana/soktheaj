<?php

namespace App\Services\Contracts;

use Illuminate\Support\Collection;

interface ExperienceServiceInterface extends BaseServiceInterface
{
    public function all(): Collection;
}