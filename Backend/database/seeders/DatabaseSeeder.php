<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Production deployments run this seeder automatically. Only populate a
        // fresh database so a normal redeploy never duplicates live content.
        if (app()->environment('production') && User::query()->exists()) {
            return;
        }

        $this->call([
            UserSeeder::class,
            AchievementSeeder::class,
            SkillSeeder::class,
            SoftwareApplicationSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            PartnerSeeder::class,
            SocialSeeder::class,
            MessageSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
