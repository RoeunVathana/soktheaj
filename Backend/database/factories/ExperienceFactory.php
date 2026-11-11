<?php

namespace Database\Factories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExperienceFactory extends Factory
{
    protected $model = Experience::class;

    public function definition(): array
    {
        $jobTitleEn = fake()->jobTitle();

        return [
            'job_title' => [
                'en' => $jobTitleEn,
                'kh' => 'តំណែង ' . fake()->word(),
            ],
            'company_name' => [
                'en' => fake()->company(),
                'kh' => 'ក្រុមហ៊ុន ' . fake()->company(),
            ],
            'company_logo' => null,
            'location' => [
                'en' => fake()->city() . ', ' . fake()->country(),
                'kh' => fake()->city() . ', ប្រទេសកម្ពុជា',
            ],
            'description' => [
                'en' => fake()->paragraphs(2, true),
                'kh' => 'បទពិសោធន៍ការងារ ' . fake()->sentence(5),
            ],
            'start_date' => fake()->dateTimeBetween('-10 years', '-1 year')->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'is_current' => fake()->boolean(10),
        ];
    }

    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => null,
            'is_current' => true,
        ]);
    }
}