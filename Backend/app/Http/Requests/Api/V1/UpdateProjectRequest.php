<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $projectId = $this->route('project');
        // Route-model binding returns a Project model instance, so get the ID
        $projectId = $projectId instanceof Project ? $projectId->id : $projectId;

        return [
            // Accept either a JSON string (from FormData/multipart) or an array for translatable fields
            'title' => 'sometimes|required|max:1000',
            'title.en' => 'sometimes|required|string|max:255',
            'title.kh' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug,'.$projectId,
            'description' => 'nullable|max:5000',
            'description.en' => 'nullable|string',
            'description.kh' => 'nullable|string',
            'thumbnail' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'demo_link' => ['nullable', $this->localizedUrlRule()],
            'github_link' => ['nullable', $this->localizedUrlRule()],
            // Accept any string (Google Drive view/direct links, relative paths, etc.)
            'file_path' => 'nullable|string|max:1000',
            'is_featured' => 'nullable|boolean',
            'software_ids' => 'nullable|array',
            'software_ids.*' => 'integer|exists:software_applications,id',
        ];
    }

    private function localizedUrlRule(): \Closure
    {
        return static function (string $attribute, mixed $value, \Closure $fail): void {
            if (is_string($value)) {
                $decoded = json_decode($value, true);

                if (is_array($decoded)) {
                    $value = $decoded;
                } else {
                    if ($value !== '' && (
                        strlen($value) > 2048
                        || filter_var($value, FILTER_VALIDATE_URL) === false
                    )) {
                        $fail("The {$attribute} must be a valid URL.");
                    }

                    return;
                }
            }

            if (! is_array($value) || array_is_list($value)) {
                $fail("The {$attribute} must be a URL or an object of locale URLs.");

                return;
            }

            foreach ($value as $locale => $url) {
                if (! in_array($locale, ['en', 'kh'], true)) {
                    $fail("The {$attribute} supports only en and kh locales.");

                    return;
                }

                if ($url !== null && $url !== '' && (
                    ! is_string($url)
                    || strlen($url) > 2048
                    || filter_var($url, FILTER_VALIDATE_URL) === false
                )) {
                    $fail("The {$attribute}.{$locale} must be a valid URL.");

                    return;
                }
            }
        };
    }
}
