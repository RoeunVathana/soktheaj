<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'sender_name' => fake()->name(),
            'sender_email' => fake()->safeEmail(),
            'subject' => fake()->sentence(),
            'message' => fake()->paragraphs(2, true),
            'is_read' => fake()->boolean(30),
        ];
    }
}