<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\ExperienceResource;
use App\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Services\Contracts\ExperienceServiceInterface;
use Illuminate\Http\JsonResponse;

class ExperienceService extends BaseService implements ExperienceServiceInterface
{
    private ExperienceRepositoryInterface $experienceRepo;

    public function __construct(ExperienceRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->experienceRepo = $repository;
    }

    public function all(): \Illuminate\Support\Collection
    {
        return $this->experienceRepo->latest();
    }

    public function store(array $data): JsonResponse
    {
        $experience = $this->experienceRepo->create($data);
        return $this->respondWithResource(ExperienceResource::class, $experience, 'Experience created successfully', 201);
    }

    public function show($experience): JsonResponse
    {
        return $this->respondWithResource(ExperienceResource::class, $experience);
    }

    public function update($experience, array $data): JsonResponse
    {
        $experience = $this->experienceRepo->update($experience, $data);
        return $this->respondWithResource(ExperienceResource::class, $experience, 'Experience updated successfully');
    }

    public function destroy($experience): JsonResponse
    {
        $this->experienceRepo->delete($experience);
        return $this->respondWithMessage('Experience deleted successfully');
    }
}