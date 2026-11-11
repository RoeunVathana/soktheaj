<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $this->user()->id,
            'bio' => 'nullable|array',
            'title' => 'nullable|array',
            'headline' => 'nullable|array',
            'description' => 'nullable|array',
            'contact.email' => 'nullable|email|max:255',
            'contact.telegram' => 'nullable|string|max:255',
            'contact.telegramUsername' => 'nullable|string|max:255',
            'socials' => 'nullable|array',
            'socials.*.icon' => 'required_with:socials|string|max:50',
            'socials.*.href' => 'required_with:socials|string|max:500',
            'socials.*.label' => 'required_with:socials|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already taken.',
        ];
    }
}