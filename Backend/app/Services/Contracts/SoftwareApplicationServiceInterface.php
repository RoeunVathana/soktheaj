<?php

namespace App\Services\Contracts;

use Illuminate\Support\Collection;

interface SoftwareApplicationServiceInterface extends BaseServiceInterface
{
    public function all(): Collection;
}