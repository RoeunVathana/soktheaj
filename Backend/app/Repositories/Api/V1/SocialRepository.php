<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\SocialRepositoryInterface;
use App\Models\Social;
use Illuminate\Support\Collection;

class SocialRepository extends BaseRepository implements SocialRepositoryInterface
{
    public function __construct(Social $model)
    {
        parent::__construct($model);
    }

    public function getVisible(): Collection
    {
        return $this->model->visible()->ordered()->get();
    }

    public function getOrdered(): Collection
    {
        return $this->model->ordered()->get();
    }
}