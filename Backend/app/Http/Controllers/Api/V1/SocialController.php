<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreSocialRequest;
use App\Http\Requests\Api\V1\UpdateSocialRequest;
use App\Models\Social;
use App\Services\Contracts\SocialServiceInterface;
use Illuminate\Http\JsonResponse;

class SocialController extends Controller
{
    public function __construct(protected SocialServiceInterface $socialService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Http\Resources\Api\V1\SocialResource::collection(
                $this->socialService->all()
            ),
        ]);
    }

    public function store(StoreSocialRequest $request): JsonResponse
    {
        return $this->socialService->store($request->validated());
    }

    public function show(Social $social): JsonResponse
    {
        return $this->socialService->show($social);
    }

    public function update(UpdateSocialRequest $request, Social $social): JsonResponse
    {
        return $this->socialService->update($social, $request->validated());
    }

    public function destroy(Social $social): JsonResponse
    {
        return $this->socialService->destroy($social);
    }

    public function visible(): JsonResponse
    {
        return $this->socialService->visible();
    }
}