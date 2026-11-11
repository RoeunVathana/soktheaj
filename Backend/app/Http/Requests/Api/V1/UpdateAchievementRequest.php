<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|array',
            'title.en' => 'sometimes|required|string|max:255',
            'title.kh' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|array',
            'description.en' => 'sometimes|required|string',
            'description.kh' => 'sometimes|required|string',
            'thumbnail' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'company_logo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'school_logo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ];
    }
}