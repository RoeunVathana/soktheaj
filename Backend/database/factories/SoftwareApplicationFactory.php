<?php

namespace Database\Factories;

use App\Models\SoftwareApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

class SoftwareApplicationFactory extends Factory
{
    protected $model = SoftwareApplication::class;

    public function definition(): array
    {
        $nameEn = fake()->unique()->randomElement([
            'VS Code', 'PhpStorm', 'WebStorm', 'Figma', 'Photoshop',
            'Illustrator', 'Premiere Pro', 'After Effects', 'Blender',
            'Docker Desktop', 'Postman', 'TablePlus', 'HeidiSQL',
            'GitHub Desktop', 'Sourcetree', 'Notion', 'Slack', 'Discord',
        ]);

        return [
            'name' => [
                'en' => $nameEn,
                'kh' => 'កម្មវិធី ' . $nameEn,
            ],
            'icon' => null,
            'type' => fake()->randomElement(['IDE', 'Design', 'Database', 'DevOps', 'Communication', 'Productivity']),
        ];
    }
}