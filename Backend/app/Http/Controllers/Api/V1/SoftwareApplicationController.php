<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreSoftwareApplicationRequest;
use App\Http\Requests\Api\V1\UpdateSoftwareApplicationRequest;
use App\Models\SoftwareApplication;
use App\Services\Contracts\SoftwareApplicationServiceInterface;
use Illuminate\Http\JsonResponse;

class SoftwareApplicationController extends Controller
{
    public function __construct(protected SoftwareApplicationServiceInterface $appService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Http\Resources\Api\V1\SoftwareApplicationResource::collection(
                $this->appService->all()
            ),
        ]);
    }

    public function store(StoreSoftwareApplicationRequest $request): JsonResponse
    {
        return $this->appService->store($request->validated());
    }

    public function show(SoftwareApplication $softwareApplication): JsonResponse
    {
        return $this->appService->show($softwareApplication);
    }

    public function update(UpdateSoftwareApplicationRequest $request, SoftwareApplication $softwareApplication): JsonResponse
    {
        return $this->appService->update($softwareApplication, $request->validated());
    }

    public function destroy(SoftwareApplication $softwareApplication): JsonResponse
    {
        return $this->appService->destroy($softwareApplication);
    }
}