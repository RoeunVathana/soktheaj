<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProjectRepositoryInterface extends BaseRepositoryInterface
{
    public function getFeatured(): Collection;

    public function findBySlug(string $slug): ?\App\Models\Project;

    public function search(string $term, int $perPage = 12): LengthAwarePaginator;

    public function incrementViews(int $projectId): void;

    public function incrementDownloads(int $projectId): void;
}