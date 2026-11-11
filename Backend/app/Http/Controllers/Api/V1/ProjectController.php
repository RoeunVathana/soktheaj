<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreProjectRequest;
use App\Http\Requests\Api\V1\UpdateProjectRequest;
use App\Models\Project;
use App\Services\Contracts\ProjectServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ProjectController extends Controller
{
    public function __construct(protected ProjectServiceInterface $projectService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->projectService->index($request);
    }

    public function show(Project $project): JsonResponse
    {
        return $this->projectService->show($project);
    }

    public function showBySlug(string $slug): JsonResponse
    {
        return $this->projectService->showBySlug($slug);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Handle thumbnail file upload — saves to storage/app/public/project/
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('project', 'public');
            $validated['thumbnail'] = $path; // Stores as "project/filename.png"
        }

        return $this->projectService->store($validated);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $validated = $request->validated();

        // Handle thumbnail file upload — saves to storage/app/public/project/
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('project', 'public');
            $validated['thumbnail'] = $path; // Stores as "project/filename.png"
        }

        return $this->projectService->update($project, $validated);
    }

    public function destroy(Project $project): JsonResponse
    {
        return $this->projectService->destroy($project);
    }

    public function featured(): JsonResponse
    {
        return $this->projectService->featured();
    }

    /**
     * Increment the download count — only once per browser session.
     *
     * Uses Laravel's Session store to remember which projects the current
     * user/session has already downloaded, preventing users from spamming
     * the download count by clicking the button repeatedly or refreshing.
     */
    public function incrementDownload(Request $request, Project $project): JsonResponse
    {
        $sessionKey = "downloaded_project_{$project->id}";

        // Only increment if this session hasn't downloaded this project before
        if (!Session::has($sessionKey)) {
            $project->increment('downloads_count');
            Session::put($sessionKey, true);
        }

        return response()->json([
            'success' => true,
            'downloads' => $project->fresh()->downloads_count,
        ]);
    }

    /**
     * Increment the view count — only once per browser session.
     *
     * Uses Laravel's Session store to remember which projects the current
     * user/session has already viewed, preventing users from spamming
     * the view count by clicking or refreshing repeatedly.
     */
    public function incrementView(Request $request, Project $project): JsonResponse
    {
        $sessionKey = "viewed_project_{$project->id}";

        // Only increment if this session hasn't viewed this project before
        if (!Session::has($sessionKey)) {
            $project->increment('views_count');
            Session::put($sessionKey, true);
        }

        return response()->json([
            'success' => true,
            'views' => $project->fresh()->views_count,
        ]);
    }
}
