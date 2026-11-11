<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\ProjectDownloadRepositoryInterface;
use App\Models\ProjectDownload;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProjectDownloadRepository extends BaseRepository implements ProjectDownloadRepositoryInterface
{
    public function __construct(ProjectDownload $model)
    {
        parent::__construct($model);
    }

    public function getWithRelations(int $perPage = 20): LengthAwarePaginator
    {
        return $this->model->with(['user', 'project'])->latest()->paginate($perPage);
    }

    public function findByProject(int $projectId): Collection
    {
        return $this->model->where('project_id', $projectId)->get();
    }
}