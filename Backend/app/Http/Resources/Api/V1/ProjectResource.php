<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail ? Storage::url($this->thumbnail) : null,
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