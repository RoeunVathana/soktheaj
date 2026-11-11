<?php

namespace App\Services\Api\V1;

use App\Repositories\Contracts\BaseRepositoryInterface;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

abstract class BaseService
{
    use ApiResponse;

    public function __construct(protected BaseRepositoryInterface $repository) {}

    protected function respondWithResource(string $resourceClass, $data, string $message = 'Success', int $code = 200): JsonResponse
    {
        return $this->success(
            $data instanceof Collection || $data instanceof LengthAwarePaginator
                ? $resourceClass::collection($data)
                : new $resourceClass($data),
            $message,
            $code
        );
    }

    protected function respondWithMessage(string $message, int $code = 200): JsonResponse
    {
        return $this->success(null, $message, $code);
    }
}