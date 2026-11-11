<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreAchievementRequest;
use App\Http\Requests\Api\V1\UpdateAchievementRequest;
use App\Http\Resources\Api\V1\AchievementResource;
use App\Models\Achievement;
use App\Services\Contracts\AchievementServiceInterface;
use Illuminate\Http\JsonResponse;

class AchievementController extends Controller
{
    public function __construct(protected AchievementServiceInterface $achievementService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => AchievementResource::collection(
                $this->achievementService->all()
            ),
        ]);
    }

    public function store(StoreAchievementRequest $request): JsonResponse
    {
        return $this->achievementService->store($request->validated());
    }

    public function show(Achievement $achievement): JsonResponse
    {
        return $this->achievementService->show($achievement);
    }

    public function update(UpdateAchievementRequest $request, Achievement $achievement): JsonResponse
    {
        return $this->achievementService->update($achievement, $request->validated());
    }

    public function destroy(Achievement $achievement): JsonResponse
    {
        return $this->achievementService->destroy($achievement);
    }
}