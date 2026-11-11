<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface SocialRepositoryInterface extends BaseRepositoryInterface
{
    public function getVisible(): Collection;

    public function getOrdered(): Collection;
}