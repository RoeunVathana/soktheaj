<?php

namespace Database\Seeders;

use App\Models\Social;
use Illuminate\Database\Seeder;

class SocialSeeder extends Seeder
{
    public function run(): void
    {
        $socials = [
            [
                'platform_name' => 'GitHub',
                'url' => 'https://github.com/portfolio-user',
                'icon' => 'github-icon',
                'is_visible' => true,
                'order' => 1,
            ],
            [
                'platform_name' => 'LinkedIn',
                'url' => 'https://linkedin.com/in/portfolio-user',
                'icon' => 'linkedin-icon',
                'is_visible' => true,
                'order' => 2,
            ],
            [
                'platform_name' => 'Twitter',
                'url' => 'https://twitter.com/portfolio-user',
                'icon' => 'twitter-icon',
                'is_visible' => true,
                'order' => 3,
            ],
            [
                'platform_name' => 'Facebook',
                'url' => 'https://facebook.com/portfolio-user',
                'icon' => 'facebook-icon',
                'is_visible' => true,
                'order' => 4,
            ],
            [
                'platform_name' => 'Instagram',
                'url' => 'https://instagram.com/portfolio-user',
                'icon' => 'instagram-icon',
                'is_visible' => false,
                'order' => 5,
            ],
            [
                'platform_name' => 'YouTube',
                'url' => 'https://youtube.com/@portfolio-user',
                'icon' => 'youtube-icon',
                'is_visible' => true,
                'order' => 6,
            ],
            [
                'platform_name' => 'Dev.to',
                'url' => 'https://dev.to/portfolio-user',
                'icon' => 'devto-icon',
                'is_visible' => true,
                'order' => 7,
            ],
            [
                'platform_name' => 'Stack Overflow',
                'url' => 'https://stackoverflow.com/users/portfolio-user',
                'icon' => 'stackoverflow-icon',
                'is_visible' => true,
                'order' => 8,
            ],
        ];

        foreach ($socials as $socialData) {
            Social::create($socialData);
        }
    }
}