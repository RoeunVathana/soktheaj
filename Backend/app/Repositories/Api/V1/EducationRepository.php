<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\EducationRepositoryInterface;
use App\Models\Education;

class EducationRepository extends BaseRepository implements EducationRepositoryInterface
{
    public function __construct(Education $model)
    {
        parent::__construct($model);
    }
}