<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    protected $model = Skill::class;

    public function definition(): array
    {
        $nameEn = fake()->unique()->randomElement([
            'JavaScript', 'TypeScript', 'Python', 'PHP', 'Java', 'Go', 'Rust',
            'React', 'Vue.js', 'Angular', 'Laravel', 'Django', 'Node.js',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
            'AWS', 'Git', 'Linux', 'CSS', 'HTML', 'Sass', 'Tailwind CSS',
        ]);

        return [
            'name' => [
                'en' => $nameEn,
                'kh' => 'ជំនាញ ' . $nameEn,
            ],
            'icon' => null,
            'proficiency' => fake()->numberBetween(50, 100),
            'category' => fake()->randomElement(['frontend', 'backend', 'database']),
        ];
    }
}