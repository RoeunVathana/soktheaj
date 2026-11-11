<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\SoftwareApplicationRepositoryInterface;
use App\Models\SoftwareApplication;

class SoftwareApplicationRepository extends BaseRepository implements SoftwareApplicationRepositoryInterface
{
    public function __construct(SoftwareApplication $model)
    {
        parent::__construct($model);
    }
}