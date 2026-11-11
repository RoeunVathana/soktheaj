<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface SkillRepositoryInterface extends BaseRepositoryInterface
{
    public function getByCategory(string $category): Collection;
}