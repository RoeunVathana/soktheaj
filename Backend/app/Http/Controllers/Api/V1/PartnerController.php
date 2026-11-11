<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StorePartnerRequest;
use App\Http\Requests\Api\V1\UpdatePartnerRequest;
use App\Models\Partner;
use App\Services\Contracts\PartnerServiceInterface;
use Illuminate\Http\JsonResponse;

class PartnerController extends Controller
{
    public function __construct(protected PartnerServiceInterface $partnerService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Http\Resources\Api\V1\PartnerResource::collection(
                $this->partnerService->all()
            ),
        ]);
    }

    public function store(StorePartnerRequest $request): JsonResponse
    {
        return $this->partnerService->store($request->validated());
    }

    public function show(Partner $partner): JsonResponse
    {
        return $this->partnerService->show($partner);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): JsonResponse
    {
        return $this->partnerService->update($partner, $request->validated());
    }

    public function destroy(Partner $partner): JsonResponse
    {
        return $this->partnerService->destroy($partner);
    }

    public function visible(): JsonResponse
    {
        return $this->partnerService->visible();
    }
}