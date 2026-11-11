<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.kh' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'proficiency' => 'required|integer|min:0|max:100',
            'category' => 'required|string|in:frontend,backend,database',
        ];
    }
}