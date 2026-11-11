<?php

namespace App\Repositories\Api\V1;

use App\Repositories\BaseRepository;
use App\Repositories\Contracts\PartnerRepositoryInterface;
use App\Models\Partner;
use Illuminate\Support\Collection;

class PartnerRepository extends BaseRepository implements PartnerRepositoryInterface
{
    public function __construct(Partner $model)
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