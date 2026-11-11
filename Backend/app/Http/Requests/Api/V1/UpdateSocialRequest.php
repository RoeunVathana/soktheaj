<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSocialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'platform_name' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|string|url|max:255',
            'icon' => 'nullable|string|max:255',
            'is_visible' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ];
    }
}