<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreAchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|array',
            'title.en' => 'required|string|max:255',
            'title.kh' => 'required|string|max:255',
            'description' => 'required|array',
            'description.en' => 'required|string',
            'description.kh' => 'required|string',
            'thumbnail' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'company_logo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'school_logo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ];
    }
}