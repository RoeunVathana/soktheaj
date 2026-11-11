<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\AchievementResource;
use App\Repositories\Contracts\AchievementRepositoryInterface;
use App\Services\Contracts\AchievementServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AchievementService extends BaseService implements AchievementServiceInterface
{
    private AchievementRepositoryInterface $achievementRepo;

    public function __construct(AchievementRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->achievementRepo = $repository;
    }

    public function all(): \Illuminate\Support\Collection
    {
        return $this->achievementRepo->latest();
    }

    public function store(array $data): JsonResponse
    {
        $data = $this->handleImageUploads($data);
        $achievement = $this->achievementRepo->create($data);
        return $this->respondWithResource(AchievementResource::class, $achievement, 'Achievement created successfully', 201);
    }

    public function show($achievement): JsonResponse
    {
        return $this->respondWithResource(AchievementResource::class, $achievement);
    }

    public function update($achievement, array $data): JsonResponse
    {
        $data = $this->handleImageUploads($data, $achievement);
        $achievement = $this->achievementRepo->update($achievement, $data);
        return $this->respondWithResource(AchievementResource::class, $achievement, 'Achievement updated successfully');
    }

    public function destroy($achievement): JsonResponse
    {
        // Delete associated images
        $this->deleteAchievementImages($achievement);
        $this->achievementRepo->delete($achievement);
        return $this->respondWithMessage('Achievement deleted successfully');
    }

    /**
     * Handle image uploads for thumbnail, company_logo, and school_logo.
     * Images are stored in storage/app/public/achievements/
     */
    private function handleImageUploads(array $data, $achievement = null): array
    {
        $imageFields = ['thumbnail', 'company_logo', 'school_logo'];

        foreach ($imageFields as $field) {
            if (isset($data[$field]) && $data[$field] instanceof UploadedFile) {
                // Delete old image if updating
                if ($achievement && $achievement->{$field}) {
                    Storage::disk('public')->delete($achievement->{$field});
                }

                // Store new image
                $data[$field] = $data[$field]->store('achievements', 'public');
            }
        }

        return $data;
    }

    /**
     * Delete all associated images when an achievement is deleted.
     */
    private function deleteAchievementImages($achievement): void
    {
        $imageFields = ['thumbnail', 'company_logo', 'school_logo'];

        foreach ($imageFields as $field) {
            if ($achievement->{$field}) {
                Storage::disk('public')->delete($achievement->{$field});
            }
        }
    }
}