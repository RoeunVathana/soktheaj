<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerRequest extends FormRequest
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
            'logo' => 'nullable|string|max:255',
            'website_url' => 'nullable|string|url|max:255',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string',
            'description.kh' => 'nullable|string',
            'is_visible' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ];
    }
}