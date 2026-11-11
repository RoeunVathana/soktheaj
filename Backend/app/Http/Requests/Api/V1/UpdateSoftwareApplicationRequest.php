<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSoftwareApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|array',
            'name.en' => 'sometimes|required|string|max:255',
            'name.kh' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'platform' => 'nullable|string|max:255',
            'description' => 'nullable',
            'description.en' => 'nullable|string',
            'description.kh' => 'nullable|string',
            'url' => 'nullable|string|max:255',
        ];
    }
}