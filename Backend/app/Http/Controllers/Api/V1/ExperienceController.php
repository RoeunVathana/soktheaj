<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreExperienceRequest;
use App\Http\Requests\Api\V1\UpdateExperienceRequest;
use App\Models\Experience;
use App\Services\Contracts\ExperienceServiceInterface;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    public function __construct(protected ExperienceServiceInterface $experienceService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Http\Resources\Api\V1\ExperienceResource::collection(
                $this->experienceService->all()
            ),
        ]);
    }

    public function store(StoreExperienceRequest $request): JsonResponse
    {
        return $this->experienceService->store($request->validated());
    }

    public function show(Experience $experience): JsonResponse
    {
        return $this->experienceService->show($experience);
    }

    public function update(UpdateExperienceRequest $request, Experience $experience): JsonResponse
    {
        return $this->experienceService->update($experience, $request->validated());
    }

    public function destroy(Experience $experience): JsonResponse
    {
        return $this->experienceService->destroy($experience);
    }
}