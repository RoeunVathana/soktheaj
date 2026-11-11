<?php

namespace App\Services\Api\V1;

use App\Repositories\Contracts\ProjectDownloadRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Services\Contracts\ProjectDownloadServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectDownloadService extends BaseService implements ProjectDownloadServiceInterface
{
    private ProjectDownloadRepositoryInterface $downloadRepo;
    private ProjectRepositoryInterface $projectRepo;

    public function __construct(
        ProjectDownloadRepositoryInterface $repository,
        ProjectRepositoryInterface $projectRepository
    ) {
        parent::__construct($repository);
        $this->downloadRepo = $repository;
        $this->projectRepo = $projectRepository;
    }

    public function index(): JsonResponse
    {
        $downloads = $this->downloadRepo->getWithRelations();
        return $this->success($downloads);
    }

    public function store(Request $request, $project): JsonResponse
    {
        $download = $this->downloadRepo->create([
            'user_id' => $request->user()?->id,
            'project_id' => $project->id,
            'ip_address' => $request->ip(),
        ]);

        $this->projectRepo->incrementDownloads($project->id);

        return $this->success($download, 'Download recorded successfully', 201);
    }

    public function show($projectDownload): JsonResponse
    {
        return $this->success($projectDownload->load(['user', 'project']));
    }

    public function update($projectDownload, array $data): JsonResponse
    {
        $projectDownload = $this->downloadRepo->update($projectDownload, $data);
        return $this->success($projectDownload, 'Download record updated successfully');
    }

    public function destroy($projectDownload): JsonResponse
    {
        $this->downloadRepo->delete($projectDownload);
        return $this->respondWithMessage('Download record deleted successfully');
    }
}