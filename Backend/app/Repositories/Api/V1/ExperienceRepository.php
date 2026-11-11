<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Models\Experience;

class ExperienceRepository extends BaseRepository implements ExperienceRepositoryInterface
{
    public function __construct(Experience $model)
    {
        parent::__construct($model);
    }
}