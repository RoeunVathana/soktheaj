<?php

namespace Database\Factories;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartnerFactory extends Factory
{
    protected $model = Partner::class;

    public function definition(): array
    {
        $nameEn = fake()->company();

        return [
            'name' => [
                'en' => $nameEn,
                'kh' => 'ក្រុមហ៊ុន ' . $nameEn,
            ],
            'logo' => 'https://picsum.photos/seed/' . fake()->unique()->word() . '/200/200',
            'website_url' => fake()->url(),
            'description' => [
                'en' => fake()->paragraph(),
                'kh' => 'ការពិពណ៌នា ' . fake()->sentence(5),
            ],
            'is_visible' => fake()->boolean(80),
            'order' => fake()->numberBetween(0, 20),
        ];
    }
}