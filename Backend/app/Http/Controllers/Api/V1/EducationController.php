<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreEducationRequest;
use App\Http\Requests\Api\V1\UpdateEducationRequest;
use App\Models\Education;
use App\Services\Contracts\EducationServiceInterface;
use Illuminate\Http\JsonResponse;

class EducationController extends Controller
{
    public function __construct(protected EducationServiceInterface $educationService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Http\Resources\Api\V1\EducationResource::collection(
                $this->educationService->all()
            ),
        ]);
    }

    public function store(StoreEducationRequest $request): JsonResponse
    {
        return $this->educationService->store($request->validated());
    }

    public function show(Education $education): JsonResponse
    {
        return $this->educationService->show($education);
    }

    public function update(UpdateEducationRequest $request, Education $education): JsonResponse
    {
        return $this->educationService->update($education, $request->validated());
    }

    public function destroy(Education $education): JsonResponse
    {
        return $this->educationService->destroy($education);
    }
}