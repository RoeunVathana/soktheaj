<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\AchievementRepositoryInterface;
use App\Models\Achievement;

class AchievementRepository extends BaseRepository implements AchievementRepositoryInterface
{
    public function __construct(Achievement $model)
    {
        parent::__construct($model);
    }
}