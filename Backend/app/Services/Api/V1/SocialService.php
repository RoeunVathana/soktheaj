<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\SocialResource;
use App\Repositories\Contracts\SocialRepositoryInterface;
use App\Services\Contracts\SocialServiceInterface;
use Illuminate\Http\JsonResponse;

class SocialService extends BaseService implements SocialServiceInterface
{
    private SocialRepositoryInterface $socialRepo;

    public function __construct(SocialRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->socialRepo = $repository;
    }

    public function all(): \Illuminate\Support\Collection
    {
        return $this->socialRepo->getOrdered();
    }

    public function store(array $data): JsonResponse
    {
        $social = $this->socialRepo->create($data);
        return $this->respondWithResource(SocialResource::class, $social, 'Social link created successfully', 201);
    }

    public function show($social): JsonResponse
    {
        return $this->respondWithResource(SocialResource::class, $social);
    }

    public function update($social, array $data): JsonResponse
    {
        $social = $this->socialRepo->update($social, $data);
        return $this->respondWithResource(SocialResource::class, $social, 'Social link updated successfully');
    }

    public function destroy($social): JsonResponse
    {
        $this->socialRepo->delete($social);
        return $this->respondWithMessage('Social link deleted successfully');
    }

    public function visible(): JsonResponse
    {
        $socials = $this->socialRepo->getVisible();
        return $this->respondWithResource(SocialResource::class, $socials);
    }
}