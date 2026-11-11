<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\PartnerResource;
use App\Repositories\Contracts\PartnerRepositoryInterface;
use App\Services\Contracts\PartnerServiceInterface;
use Illuminate\Http\JsonResponse;

class PartnerService extends BaseService implements PartnerServiceInterface
{
    private PartnerRepositoryInterface $partnerRepo;

    public function __construct(PartnerRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->partnerRepo = $repository;
    }

    public function all(): \Illuminate\Support\Collection
    {
        return $this->partnerRepo->getOrdered();
    }

    public function store(array $data): JsonResponse
    {
        $partner = $this->partnerRepo->create($data);
        return $this->respondWithResource(PartnerResource::class, $partner, 'Partner created successfully', 201);
    }

    public function show($partner): JsonResponse
    {
        return $this->respondWithResource(PartnerResource::class, $partner);
    }

    public function update($partner, array $data): JsonResponse
    {
        $partner = $this->partnerRepo->update($partner, $data);
        return $this->respondWithResource(PartnerResource::class, $partner, 'Partner updated successfully');
    }

    public function destroy($partner): JsonResponse
    {
        $this->partnerRepo->delete($partner);
        return $this->respondWithMessage('Partner deleted successfully');
    }

    public function visible(): JsonResponse
    {
        $partners = $this->partnerRepo->getVisible();
        return $this->respondWithResource(PartnerResource::class, $partners);
    }
}