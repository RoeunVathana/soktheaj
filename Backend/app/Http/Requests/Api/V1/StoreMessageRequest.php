<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'sender_name' => 'required|string|max:255',
            'sender_email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'sender_name.required' => 'Name is required.',
            'sender_email.required' => 'Email is required.',
            'sender_email.email' => 'Please provide a valid email address.',
            'subject.required' => 'Subject is required.',
            'message.required' => 'Message is required.',
        ];
    }
}