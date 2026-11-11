<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectDownload;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectDownloadFactory extends Factory
{
    protected $model = ProjectDownload::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'ip_address' => fake()->ipv4(),
        ];
    }
}