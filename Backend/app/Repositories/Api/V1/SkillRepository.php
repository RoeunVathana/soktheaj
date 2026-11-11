<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Models\Skill;
use Illuminate\Support\Collection;

class SkillRepository extends BaseRepository implements SkillRepositoryInterface
{
    public function __construct(Skill $model)
    {
        parent::__construct($model);
    }

    public function getByCategory(string $category): Collection
    {
        return $this->model->byCategory($category)->latest()->get();
    }
}