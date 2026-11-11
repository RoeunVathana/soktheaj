<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_title' => 'sometimes|required|array',
            'job_title.en' => 'sometimes|required|string|max:255',
            'job_title.kh' => 'sometimes|required|string|max:255',
            'company_name' => 'sometimes|required|array',
            'company_name.en' => 'sometimes|required|string|max:255',
            'company_name.kh' => 'sometimes|required|string|max:255',
            'company_logo' => 'nullable|string|max:255',
            'location' => 'nullable|array',
            'location.en' => 'nullable|string|max:255',
            'location.kh' => 'nullable|string|max:255',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string',
            'description.kh' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
        ];
    }
}