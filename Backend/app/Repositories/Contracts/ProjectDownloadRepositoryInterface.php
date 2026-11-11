<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectDownloadRepositoryInterface extends BaseRepositoryInterface
{
    public function getWithRelations(int $perPage = 20): LengthAwarePaginator;

    public function findByProject(int $projectId): \Illuminate\Support\Collection;
}