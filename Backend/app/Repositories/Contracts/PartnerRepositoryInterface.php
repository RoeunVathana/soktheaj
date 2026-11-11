<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface PartnerRepositoryInterface extends BaseRepositoryInterface
{
    public function getVisible(): Collection;

    public function getOrdered(): Collection;
}