<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'degree' => 'sometimes|required|array',
            'degree.en' => 'sometimes|required|string|max:255',
            'degree.kh' => 'sometimes|required|string|max:255',
            'institution' => 'sometimes|required|array',
            'institution.en' => 'sometimes|required|string|max:255',
            'institution.kh' => 'sometimes|required|string|max:255',
            'school_logo' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|array',
            'field_of_study.en' => 'nullable|string|max:255',
            'field_of_study.kh' => 'nullable|string|max:255',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string',
            'description.kh' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}