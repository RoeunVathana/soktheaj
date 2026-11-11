<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
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
            'proficiency' => 'sometimes|required|integer|min:0|max:100',
            'category' => 'sometimes|required|string|in:frontend,backend,database',
        ];
    }
}