<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\SkillResource;
use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Services\Contracts\SkillServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillService extends BaseService implements SkillServiceInterface
{
    private SkillRepositoryInterface $skillRepo;

    public function __construct(SkillRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->skillRepo = $repository;
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->has('category')) {
            $skills = $this->skillRepo->getByCategory($request->string('category'));
        } else {
            $skills = $this->skillRepo->latest();
        }
        return $this->respondWithResource(SkillResource::class, $skills);
    }

    public function store(array $data): JsonResponse
    {
        $skill = $this->skillRepo->create($data);
        return $this->respondWithResource(SkillResource::class, $skill, 'Skill created successfully', 201);
    }

    public function show($skill): JsonResponse
    {
        return $this->respondWithResource(SkillResource::class, $skill);
    }

    public function update($skill, array $data): JsonResponse
    {
        $skill = $this->skillRepo->update($skill, $data);
        return $this->respondWithResource(SkillResource::class, $skill, 'Skill updated successfully');
    }

    public function destroy($skill): JsonResponse
    {
        $this->skillRepo->delete($skill);
        return $this->respondWithMessage('Skill deleted successfully');
    }
}