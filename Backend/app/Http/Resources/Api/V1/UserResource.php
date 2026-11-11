<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Format a single avatar path into a full absolute URL.
     *
     * Handles:
     *  1. JSON array strings: ["/storage/avatars/filename.png"] → extract first element
     *  2. Already absolute URLs (http://...) → return as-is
     *  3. Relative paths (avatars/filename.png, /storage/avatars/filename.png) → prepend asset()
     *  4. null/empty → return null
     */
    private function formatAvatar($avatarPath): ?string
    {
        if (!$avatarPath) {
            return null;
        }

        // 1. Handle JSON array string — decode and take the first element
        if (is_string($avatarPath) && str_starts_with($avatarPath, '[')) {
            $decoded = json_decode($avatarPath, true);
            $avatarPath = $decoded[0] ?? null;
        }

        if (!$avatarPath) {
            return null;
        }

        // 2. Return absolute URL if already a full URL
        if (str_starts_with($avatarPath, 'http')) {
            return $avatarPath;
        }

        // 3. Clean the path and prepend the storage URL
        $cleanPath = ltrim(str_replace('/storage/', '', $avatarPath), '/');
        return asset('storage/' . $cleanPath);
    }

    public function toArray(Request $request): array
    {
        // Format the single avatar field
        $formattedAvatar = $this->formatAvatar($this->avatar);

        // Ensure avatars is an array and fix backslashes, prepend full URL
        $rawAvatars = $this->avatars ?? [];
        if (is_string($rawAvatars)) {
            $rawAvatars = json_decode($rawAvatars, true) ?? [];
        }
        $formattedAvatars = array_map(function ($path) {
            return $this->formatAvatar($path);
        }, $rawAvatars);
        // Remove any null entries from the avatars array
        $formattedAvatars = array_values(array_filter($formattedAvatars));

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'title' => $this->title,
            'headline' => $this->headline,
            'description' => $this->description,
            'bio' => $this->bio,
            'contact' => $this->contact,
            'socials' => $this->socials,
            'avatar' => $formattedAvatar,
            'avatars' => $formattedAvatars,
            'two_factor_enabled' => (bool) $this->two_factor_enabled,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}