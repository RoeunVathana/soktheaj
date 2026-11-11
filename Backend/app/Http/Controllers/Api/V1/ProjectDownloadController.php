<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectDownload;
use App\Services\Contracts\ProjectDownloadServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectDownloadController extends Controller
{
    public function __construct(protected ProjectDownloadServiceInterface $downloadService) {}

    public function index(): JsonResponse
    {
        return $this->downloadService->index();
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        return $this->downloadService->store($request, $project);
    }

    public function show(ProjectDownload $projectDownload): JsonResponse
    {
        return $this->downloadService->show($projectDownload);
    }

    public function destroy(ProjectDownload $projectDownload): JsonResponse
    {
        return $this->downloadService->destroy($projectDownload);
    }
}