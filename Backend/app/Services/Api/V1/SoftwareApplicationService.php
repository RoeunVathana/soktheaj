<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\SoftwareApplicationResource;
use App\Repositories\Contracts\SoftwareApplicationRepositoryInterface;
use App\Services\Contracts\SoftwareApplicationServiceInterface;
use Illuminate\Http\JsonResponse;

class SoftwareApplicationService extends BaseService implements SoftwareApplicationServiceInterface
{
    private SoftwareApplicationRepositoryInterface $appRepo;

    public function __construct(SoftwareApplicationRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->appRepo = $repository;
    }

    public function all(): \Illuminate\Support\Collection
    {
        return $this->appRepo->latest();
    }

    public function store(array $data): JsonResponse
    {
        $application = $this->appRepo->create($data);
        return $this->respondWithResource(SoftwareApplicationResource::class, $application, 'Software application created successfully', 201);
    }

    public function show($application): JsonResponse
    {
        return $this->respondWithResource(SoftwareApplicationResource::class, $application);
    }

    public function update($application, array $data): JsonResponse
    {
        $application = $this->appRepo->update($application, $data);
        return $this->respondWithResource(SoftwareApplicationResource::class, $application, 'Software application updated successfully');
    }

    public function destroy($application): JsonResponse
    {
        $this->appRepo->delete($application);
        return $this->respondWithMessage('Software application deleted successfully');
    }
}