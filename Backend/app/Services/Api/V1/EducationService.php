<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\EducationResource;
use App\Repositories\Contracts\EducationRepositoryInterface;
use App\Services\Contracts\EducationServiceInterface;
use Illuminate\Http\JsonResponse;

class EducationService extends BaseService implements EducationServiceInterface
{
    private EducationRepositoryInterface $educationRepo;

    public function __construct(EducationRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->educationRepo = $repository;
    }

    public function all(): \Illuminate\Support\Collection
    {
        return $this->educationRepo->latest();
    }

    public function store(array $data): JsonResponse
    {
        $education = $this->educationRepo->create($data);
        return $this->respondWithResource(EducationResource::class, $education, 'Education created successfully', 201);
    }

    public function show($education): JsonResponse
    {
        return $this->respondWithResource(EducationResource::class, $education);
    }

    public function update($education, array $data): JsonResponse
    {
        $education = $this->educationRepo->update($education, $data);
        return $this->respondWithResource(EducationResource::class, $education, 'Education updated successfully');
    }

    public function destroy($education): JsonResponse
    {
        $this->educationRepo->delete($education);
        return $this->respondWithMessage('Education deleted successfully');
    }
}