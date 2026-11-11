<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // Frontend skills
            ['name' => ['en' => 'React', 'kh' => 'រ៉េអាក់'], 'icon' => 'react-icon', 'proficiency' => 95, 'category' => 'frontend'],
            ['name' => ['en' => 'Vue.js', 'kh' => 'វូយ'], 'icon' => 'vue-icon', 'proficiency' => 85, 'category' => 'frontend'],
            ['name' => ['en' => 'TypeScript', 'kh' => 'ថាយប៉ស្គ្រីប'], 'icon' => 'typescript-icon', 'proficiency' => 90, 'category' => 'frontend'],
            ['name' => ['en' => 'Tailwind CSS', 'kh' => 'តេលវីនដ CSS'], 'icon' => 'tailwind-icon', 'proficiency' => 92, 'category' => 'frontend'],
            ['name' => ['en' => 'JavaScript', 'kh' => 'ចាវ៉ាស្គ្រីប'], 'icon' => 'javascript-icon', 'proficiency' => 95, 'category' => 'frontend'],
            ['name' => ['en' => 'HTML/CSS', 'kh' => 'HTML/CSS'], 'icon' => 'html-icon', 'proficiency' => 98, 'category' => 'frontend'],
            ['name' => ['en' => 'Next.js', 'kh' => 'ណិកស៍'], 'icon' => 'nextjs-icon', 'proficiency' => 80, 'category' => 'frontend'],

            // Backend skills
            ['name' => ['en' => 'Laravel', 'kh' => 'ឡារ៉ាវែល'], 'icon' => 'laravel-icon', 'proficiency' => 92, 'category' => 'backend'],
            ['name' => ['en' => 'Node.js', 'kh' => 'ណូដ'], 'icon' => 'nodejs-icon', 'proficiency' => 88, 'category' => 'backend'],
            ['name' => ['en' => 'PHP', 'kh' => 'ភីអេចភី'], 'icon' => 'php-icon', 'proficiency' => 90, 'category' => 'backend'],
            ['name' => ['en' => 'Python', 'kh' => 'ភីថុន'], 'icon' => 'python-icon', 'proficiency' => 75, 'category' => 'backend'],
            ['name' => ['en' => 'RESTful APIs', 'kh' => 'RESTful API'], 'icon' => 'api-icon', 'proficiency' => 93, 'category' => 'backend'],

            // Database skills
            ['name' => ['en' => 'MySQL', 'kh' => 'ម៉ាយអេសឃ្យូអិល'], 'icon' => 'mysql-icon', 'proficiency' => 90, 'category' => 'database'],
            ['name' => ['en' => 'PostgreSQL', 'kh' => 'ប៉ុស្តហ្គ្រេសឃ្យូអិល'], 'icon' => 'postgresql-icon', 'proficiency' => 82, 'category' => 'database'],
            ['name' => ['en' => 'MongoDB', 'kh' => 'ម៉ុងហ្គោឌីប៊ី'], 'icon' => 'mongodb-icon', 'proficiency' => 78, 'category' => 'database'],
            ['name' => ['en' => 'Redis', 'kh' => 'រ៉េឌីស'], 'icon' => 'redis-icon', 'proficiency' => 70, 'category' => 'database'],

            // DevOps & Tools
            ['name' => ['en' => 'Docker', 'kh' => 'ដុកឃ័រ'], 'icon' => 'docker-icon', 'proficiency' => 80, 'category' => 'devops'],
            ['name' => ['en' => 'Git', 'kh' => 'ហ្គីត'], 'icon' => 'git-icon', 'proficiency' => 92, 'category' => 'devops'],
            ['name' => ['en' => 'AWS', 'kh' => 'AWS'], 'icon' => 'aws-icon', 'proficiency' => 72, 'category' => 'devops'],
        ];

        foreach ($skills as $skillData) {
            Skill::create($skillData);
        }
    }
}