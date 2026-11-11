<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'title' => 'Best Developer Award 2023',
                'description' => 'Recognized as the best full-stack developer for outstanding performance and innovative solutions delivered throughout the year.',
                'thumbnail' => '/images/achievements/award-1.png',
            ],
            [
                'title' => 'Open Source Contributor',
                'description' => 'Contributed to multiple open-source projects on GitHub, helping improve tools used by thousands of developers worldwide.',
                'thumbnail' => '/images/achievements/opensource.png',
            ],
            [
                'title' => 'Hackathon Winner',
                'description' => 'Won first place in a national hackathon by building a real-time collaboration platform for remote teams.',
                'thumbnail' => '/images/achievements/hackathon.png',
            ],
            [
                'title' => 'Certified Laravel Developer',
                'description' => 'Earned official Laravel certification demonstrating expertise in building robust, scalable backend applications.',
                'thumbnail' => '/images/achievements/laravel-cert.png',
            ],
            [
                'title' => '100+ Projects Completed',
                'description' => 'Successfully delivered over 100 web development projects for clients across various industries and scales.',
                'thumbnail' => '/images/achievements/projects.png',
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}