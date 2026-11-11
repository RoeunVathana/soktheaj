<?php

namespace App\Services\Contracts;

use Illuminate\Support\Collection;

interface EducationServiceInterface extends BaseServiceInterface
{
    public function all(): Collection;
}