<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreSkillRequest;
use App\Http\Requests\Api\V1\UpdateSkillRequest;
use App\Models\Skill;
use App\Services\Contracts\SkillServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function __construct(protected SkillServiceInterface $skillService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->skillService->index($request);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        return $this->skillService->store($request->validated());
    }

    public function show(Skill $skill): JsonResponse
    {
        return $this->skillService->show($skill);
    }

    public function update(UpdateSkillRequest $request, Skill $skill): JsonResponse
    {
        return $this->skillService->update($skill, $request->validated());
    }

    public function destroy(Skill $skill): JsonResponse
    {
        return $this->skillService->destroy($skill);
    }
}