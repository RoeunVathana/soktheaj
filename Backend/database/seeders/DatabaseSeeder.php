<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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
