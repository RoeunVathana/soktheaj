<?php

namespace App\Repositories\Api\V1;

use App\Models\Project;
use App\Repositories\BaseRepository;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProjectRepository extends BaseRepository implements ProjectRepositoryInterface
{
    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('technologies')
            ->latest()
            ->paginate($perPage);
    }

    public function latest(): Collection
    {
        return $this->model->newQuery()
            ->with('technologies')
            ->latest()
            ->get();
    }

    public function getFeatured(): Collection
    {
        return $this->model->newQuery()
            ->with('technologies')
            ->where('is_featured', true)
            ->latest()
            ->get();
    }

    public function findBySlug(string $slug): ?Project
    {
        return $this->model->newQuery()
            ->with('technologies')
            ->where('slug', $slug)
            ->first();
    }

    public function search(string $term, int $perPage = 12): LengthAwarePaginator
    {
        $locale = app()->getLocale();
        if (! in_array($locale, ['en', 'kh'], true)) {
            $locale = 'en';
        }

        $pattern = "%{$term}%";

        return $this->model->newQuery()
            ->with('technologies')
            ->where(function ($query) use ($pattern, $locale) {
                $query->where("title->{$locale}", 'ilike', $pattern)
                    ->orWhere("description->{$locale}", 'ilike', $pattern);
            })
            ->latest()
            ->paginate($perPage);
    }

    public function incrementViews(int $projectId): void
    {
        $this->model->where('id', $projectId)->increment('views_count');
    }

    public function incrementDownloads(int $projectId): void
    {
        $this->model->where('id', $projectId)->increment('downloads_count');
    }
}
