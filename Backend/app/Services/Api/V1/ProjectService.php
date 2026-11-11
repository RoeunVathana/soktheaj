<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Services\Contracts\ProjectServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class ProjectService extends BaseService implements ProjectServiceInterface
{
    private ProjectRepositoryInterface $projectRepo;

    public function __construct(ProjectRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->projectRepo = $repository;
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            // Return ALL projects (featured + non-featured) — used by the "View All" page
            $projects = $this->projectRepo->latest();
        } elseif ($request->boolean('featured')) {
            // Return only featured projects — used by the Home page
            $projects = $this->projectRepo->getFeatured();
        } elseif ($request->has('search')) {
            $projects = $this->projectRepo->search($request->string('search'), $request->integer('per_page', 12));
        } else {
            // Default: paginated all projects (admin panel)
            $projects = $this->projectRepo->paginate($request->integer('per_page', 12));
        }

        if ($projects instanceof LengthAwarePaginator) {
            return response()->json(ProjectResource::collection($projects)->response()->getData(true));
        }

        return $this->respondWithResource(ProjectResource::class, $projects);
    }

    public function show($project): JsonResponse
    {
        $project->loadMissing('technologies');
        $this->incrementViewsOncePerSession($project);

        return $this->respondWithResource(ProjectResource::class, $project);
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $project = $this->projectRepo->findBySlug($slug);
        if (! $project) {
            return $this->error('Project not found', 404);
        }
        $project->loadMissing('technologies');
        $this->incrementViewsOncePerSession($project);

        return $this->respondWithResource(ProjectResource::class, $project);
    }

    public function store(array $data): JsonResponse
    {
        // Normalize translatable fields — always results in safe associative arrays
        if (isset($data['title'])) {
            $data['title'] = $this->normalizeTranslatableField($data['title'], '');
        }
        if (isset($data['description'])) {
            $data['description'] = $this->normalizeTranslatableField($data['description'], '');
        }
        foreach (['demo_link', 'github_link'] as $field) {
            if (isset($data[$field])) {
                $data[$field] = $this->normalizeTranslatableField($data[$field], '');
            }
        }

        // Handle thumbnail file upload
        $data = $this->handleThumbnailUpload($data);

        $project = $this->projectRepo->create($data);

        // Sync software application (technology) relations if provided
        if (isset($data['software_ids']) && is_array($data['software_ids'])) {
            $techIds = array_values($data['software_ids']);
            $project->technologies()->sync($techIds);
        }

        return $this->respondWithResource(ProjectResource::class, $project->fresh()->load('technologies'), 'Project created successfully', 201);
    }

    public function update($project, array $data): JsonResponse
    {
        // Normalize translatable fields — always results in safe associative arrays
        if (isset($data['title'])) {
            $data['title'] = $this->normalizeTranslatableField($data['title'], '');
        }
        if (isset($data['description'])) {
            $data['description'] = $this->normalizeTranslatableField($data['description'], '');
        }
        foreach (['demo_link', 'github_link'] as $field) {
            if (isset($data[$field])) {
                $data[$field] = $this->normalizeTranslatableField($data[$field], '');
            }
        }

        // Handle thumbnail file upload
        $data = $this->handleThumbnailUpload($data, $project);

        $project = $this->projectRepo->update($project, $data);

        // Sync software application (technology) relations if provided
        if (isset($data['software_ids']) && is_array($data['software_ids'])) {
            $techIds = array_values($data['software_ids']);
            $project->technologies()->sync($techIds);
        }

        return $this->respondWithResource(ProjectResource::class, $project->fresh()->load('technologies'), 'Project updated successfully');
    }

    public function destroy($project): JsonResponse
    {
        // Delete associated thumbnail image
        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }

        $this->projectRepo->delete($project);

        return $this->respondWithMessage('Project deleted successfully');
    }

    /**
     * Handle thumbnail file upload.
     * Images are stored in storage/app/public/project/
     */
    private function handleThumbnailUpload(array $data, $project = null): array
    {
        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
            // Delete old thumbnail if updating
            if ($project && $project->thumbnail) {
                Storage::disk('public')->delete($project->thumbnail);
            }

            // Store new thumbnail
            $data['thumbnail'] = $data['thumbnail']->store('project', 'public');
        }

        return $data;
    }

    /**
     * Normalize a translatable field value to a safe associative array with 'en' and 'kh' keys.
     *
     * Handles:
     *  - Associative arrays (e.g. ['en' => '...', 'kh' => '...'])
     *  - JSON strings (could be object or array)
     *  - Indexed arrays (lists) from malformed JSON — converts to en/kh
     *  - Raw strings
     *  - null / unexpected types
     */
    private function normalizeTranslatableField(mixed $value, string $default = ''): array
    {
        // Already an associative array
        if (is_array($value) && ! array_is_list($value)) {
            return [
                'en' => $value['en'] ?? $default,
                'kh' => $value['kh'] ?? $value['en'] ?? $default,
            ];
        }

        // Indexed array (list) — convert by mapping position 0→en, 1→kh
        if (is_array($value) && array_is_list($value)) {
            return [
                'en' => $value[0] ?? $default,
                'kh' => $value[1] ?? $value[0] ?? $default,
            ];
        }

        // JSON string — decode and recurse
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return $this->normalizeTranslatableField($decoded, $default);
            }

            // Plain string fallback
            return ['en' => $value, 'kh' => $value];
        }

        // Fallback for null / unexpected types
        return ['en' => $default, 'kh' => $default];
    }

    public function featured(): JsonResponse
    {
        $projects = $this->projectRepo->getFeatured();

        return $this->respondWithResource(ProjectResource::class, $projects);
    }

    /**
     * Increment the project's view count only once per browser session.
     *
     * Prevents view-count spam from repeated page loads, refreshes,
     * and direct navigation to the same project detail page.
     *
     * @param  Project  $project
     */
    private function incrementViewsOncePerSession($project): void
    {
        $sessionKey = "viewed_project_{$project->id}";

        if (! Session::has($sessionKey)) {
            $this->projectRepo->incrementViews($project->id);
            Session::put($sessionKey, true);
        }
    }
}
