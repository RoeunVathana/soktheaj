<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_title' => 'required|array',
            'job_title.en' => 'required|string|max:255',
            'job_title.kh' => 'required|string|max:255',
            'company_name' => 'required|array',
            'company_name.en' => 'required|string|max:255',
            'company_name.kh' => 'required|string|max:255',
            'company_logo' => 'nullable|string|max:255',
            'location' => 'nullable|array',
            'location.en' => 'nullable|string|max:255',
            'location.kh' => 'nullable|string|max:255',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string',
            'description.kh' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|boolean',
        ];
    }
}