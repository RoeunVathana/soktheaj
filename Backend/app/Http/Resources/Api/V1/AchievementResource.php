<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AchievementResource extends JsonResource
{
    private function imageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // Keep seeded/external image URLs intact instead of prefixing them
        // with the local storage path.
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
            'description' => $this->description,
            'thumbnail' => $this->imageUrl($this->thumbnail),
            'company_logo' => $this->imageUrl($this->company_logo),
            'school_logo' => $this->imageUrl($this->school_logo),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
