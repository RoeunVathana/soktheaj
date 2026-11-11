<?php

namespace Database\Factories;

use App\Models\Social;
use Illuminate\Database\Eloquent\Factories\Factory;

class SocialFactory extends Factory
{
    protected $model = Social::class;

    public function definition(): array
    {
        return [
            'platform_name' => fake()->unique()->randomElement([
                'GitHub', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram',
                'YouTube', 'Dribbble', 'Behance', 'Medium', 'Dev.to',
                'Stack Overflow', 'CodePen', 'GitLab', 'Bitbucket',
            ]),
            'url' => fake()->url(),
            'icon' => null,
            'is_visible' => fake()->boolean(80),
            'order' => fake()->numberBetween(0, 20),
        ];
    }
}