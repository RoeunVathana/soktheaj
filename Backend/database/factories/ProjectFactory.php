<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $titleEn = fake()->unique()->sentence(3);
        $titleKh = 'គម្រោង ' . fake()->word();

        return [
            'title' => [
                'en' => $titleEn,
                'kh' => $titleKh,
            ],
            'slug' => Str::slug($titleEn),
            'description' => [
                'en' => fake()->paragraphs(3, true),
                'kh' => 'ការពិពណ៌នាអំពីគម្រោង ' . fake()->sentence(5),
            ],
            'thumbnail' => 'https://picsum.photos/seed/' . Str::random(10) . '/800/600',
            'demo_link' => fake()->url(),
            'github_link' => 'https://github.com/' . fake()->userName() . '/' . Str::slug($titleEn),
            'file_path' => null,
            'views_count' => fake()->numberBetween(0, 1000),
            'downloads_count' => fake()->numberBetween(0, 100),
            'is_featured' => fake()->boolean(20),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}