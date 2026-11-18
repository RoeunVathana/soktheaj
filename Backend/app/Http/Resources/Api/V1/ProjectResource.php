<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    private function imageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // Seeded projects may already contain a remote URL. Do not turn it
        // into an invalid `/storage/https://...` path.
        if (filter_var($path, FILTER_VALIDATE_URL) || str_starts_with($path, '/storage/')) {
            return $path;
        }

        return Storage::url($path);
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'thumbnail' => $this->imageUrl($this->thumbnail),
            'demo_link' => $this->demo_link,
            'github_link' => $this->github_link,
            'file_path' => $this->file_path,
            'views_count' => $this->views_count,
            'downloads_count' => $this->downloads_count,
            'is_featured' => $this->is_featured,
            'technologies' => $this->whenLoaded('technologies', fn () => SoftwareApplicationResource::collection($this->technologies)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
