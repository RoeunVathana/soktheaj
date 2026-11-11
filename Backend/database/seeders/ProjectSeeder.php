<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectDownload;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => ['en' => 'E-Commerce Platform', 'kh' => 'វេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិក'],
                'description' => [
                    'en' => 'A full-featured e-commerce platform built with Laravel and React. Includes shopping cart, payment gateway integration, order management, and admin dashboard.',
                    'kh' => 'វេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិកពេញលេញដែលបង្កើតឡើងជាមួយ Laravel និង React',
                ],
                'thumbnail' => 'https://picsum.photos/seed/ecommerce/800/600',
                'demo_link' => 'https://demo-ecommerce.example.com',
                'github_link' => 'https://github.com/portfolio/ecommerce-platform',
                'file_path' => null,
                'views_count' => 1500,
                'downloads_count' => 45,
                'is_featured' => true,
            ],
            [
                'title' => ['en' => 'Task Management System', 'kh' => 'ប្រព័ន្ធគ្រប់គ្រងភារកិច្ច'],
                'description' => [
                    'en' => 'A collaborative task management application with real-time updates, team workspaces, Kanban boards, and progress tracking features.',
                    'kh' => 'កម្មវិធីគ្រប់គ្រងភារកិច្ចសហការជាមួយការធ្វើបច្ចុប្បន្នភាពពេលជាក់ស្តែង',
                ],
                'thumbnail' => 'https://picsum.photos/seed/taskmanager/800/600',
                'demo_link' => 'https://demo-taskmanager.example.com',
                'github_link' => 'https://github.com/portfolio/task-management',
                'file_path' => null,
                'views_count' => 2300,
                'downloads_count' => 120,
                'is_featured' => true,
            ],
            [
                'title' => ['en' => 'Real-Time Chat Application', 'kh' => 'កម្មវិធីជជែកកំសាន្តពេលជាក់ស្តែង'],
                'description' => [
                    'en' => 'A real-time messaging application built with WebSockets. Features include private messaging, group chats, file sharing, and online status indicators.',
                    'kh' => 'កម្មវិធីផ្ញើសារពេលជាក់ស្តែងដែលបង្កើតឡើងជាមួយ WebSockets',
                ],
                'thumbnail' => 'https://picsum.photos/seed/chatapp/800/600',
                'demo_link' => 'https://demo-chat.example.com',
                'github_link' => 'https://github.com/portfolio/chat-application',
                'file_path' => null,
                'views_count' => 3200,
                'downloads_count' => 200,
                'is_featured' => true,
            ],
            [
                'title' => ['en' => 'Portfolio Website', 'kh' => 'គេហទំព័រផតថូលីយ៉ូ'],
                'description' => [
                    'en' => 'A modern portfolio website built with Laravel backend and React frontend. Features project showcase, blog, contact form, and admin panel.',
                    'kh' => 'គេហទំព័រផតថូលីយ៉ូទំនើបដែលបង្កើតឡើងជាមួយ Laravel backend និង React frontend',
                ],
                'thumbnail' => 'https://picsum.photos/seed/portfolio/800/600',
                'demo_link' => 'https://portfolio.example.com',
                'github_link' => 'https://github.com/portfolio/portfolio-website',
                'file_path' => null,
                'views_count' => 5000,
                'downloads_count' => 350,
                'is_featured' => true,
            ],
            [
                'title' => ['en' => 'Blog Platform with CMS', 'kh' => 'វេទិកាប្លុកជាមួយ CMS'],
                'description' => [
                    'en' => 'A content management system for blogging with rich text editor, SEO optimization, social sharing, and analytics integration.',
                    'kh' => 'ប្រព័ន្ធគ្រប់គ្រងមាតិកាសម្រាប់ការសរសេរប្លុក',
                ],
                'thumbnail' => 'https://picsum.photos/seed/blogcms/800/600',
                'demo_link' => 'https://demo-blog.example.com',
                'github_link' => 'https://github.com/portfolio/blog-cms',
                'file_path' => null,
                'views_count' => 1800,
                'downloads_count' => 80,
                'is_featured' => false,
            ],
            [
                'title' => ['en' => 'RESTful API Boilerplate', 'kh' => 'គំរូ API RESTful'],
                'description' => [
                    'en' => 'A production-ready RESTful API boilerplate with authentication, rate limiting, API documentation, and testing suite.',
                    'kh' => 'គំរូ API RESTful ដែលត្រៀមរួចជាស្រេចសម្រាប់ផលិតកម្ម',
                ],
                'thumbnail' => 'https://picsum.photos/seed/apiboilerplate/800/600',
                'demo_link' => 'https://api-docs.example.com',
                'github_link' => 'https://github.com/portfolio/api-boilerplate',
                'file_path' => 'downloads/api-boilerplate-v1.0.zip',
                'views_count' => 4500,
                'downloads_count' => 500,
                'is_featured' => true,
            ],
            [
                'title' => ['en' => 'Inventory Management System', 'kh' => 'ប្រព័ន្ធគ្រប់គ្រងស្តុកទំនិញ'],
                'description' => [
                    'en' => 'An inventory management system with barcode scanning, stock alerts, supplier management, and sales reporting.',
                    'kh' => 'ប្រព័ន្ធគ្រប់គ្រងស្តុកទំនិញជាមួយការស្កេនបាកូដ',
                ],
                'thumbnail' => 'https://picsum.photos/seed/inventory/800/600',
                'demo_link' => 'https://demo-inventory.example.com',
                'github_link' => 'https://github.com/portfolio/inventory-system',
                'file_path' => null,
                'views_count' => 980,
                'downloads_count' => 30,
                'is_featured' => false,
            ],
            [
                'title' => ['en' => 'Learning Management System', 'kh' => 'ប្រព័ន្ធគ្រប់គ្រងការសិក្សា'],
                'description' => [
                    'en' => 'An online learning platform with course creation, video streaming, quizzes, certificates, and student progress tracking.',
                    'kh' => 'វេទិកាសិក្សាតាមអ៊ីនធឺណិតជាមួយការបង្កើតវគ្គសិក្សា',
                ],
                'thumbnail' => 'https://picsum.photos/seed/lms/800/600',
                'demo_link' => 'https://demo-lms.example.com',
                'github_link' => 'https://github.com/portfolio/lms-platform',
                'file_path' => null,
                'views_count' => 2800,
                'downloads_count' => 150,
                'is_featured' => true,
            ],
            [
                'title' => ['en' => 'Weather Dashboard', 'kh' => 'ផ្ទាំងគ្រប់គ្រងអាកាសធាតុ'],
                'description' => [
                    'en' => 'A weather dashboard that displays real-time weather data, forecasts, and historical charts using OpenWeatherMap API.',
                    'kh' => 'ផ្ទាំងគ្រប់គ្រងអាកាសធាតុដែលបង្ហាញទិន្នន័យអាកាសធាតុពេលជាក់ស្តែង',
                ],
                'thumbnail' => 'https://picsum.photos/seed/weather/800/600',
                'demo_link' => 'https://weather-dashboard.example.com',
                'github_link' => 'https://github.com/portfolio/weather-dashboard',
                'file_path' => null,
                'views_count' => 1200,
                'downloads_count' => 60,
                'is_featured' => false,
            ],
            [
                'title' => ['en' => 'Social Media Analytics Tool', 'kh' => 'ឧបករណ៍វិភាគប្រព័ន្ធផ្សព្វផ្សាយសង្គម'],
                'description' => [
                    'en' => 'A social media analytics tool that tracks engagement metrics, generates reports, and provides insights for multiple platforms.',
                    'kh' => 'ឧបករណ៍វិភាគប្រព័ន្ធផ្សព្វផ្សាយសង្គមដែលតាមដានម៉ែត្រការចូលរួម',
                ],
                'thumbnail' => 'https://picsum.photos/seed/socialanalytics/800/600',
                'demo_link' => 'https://social-analytics.example.com',
                'github_link' => 'https://github.com/portfolio/social-analytics',
                'file_path' => null,
                'views_count' => 750,
                'downloads_count' => 25,
                'is_featured' => false,
            ],
            [
                'title' => ['en' => 'Payment Checkin System', 'kh' => 'ប្រព័ន្ធត្រួតពិនិត្យការទូទាត់'],
                'description' => [
                    'en' => 'A payment check-in system for managing and tracking payment transactions efficiently.',
                    'kh' => 'ប្រព័ន្ធត្រួតពិនិត្យការទូទាត់សម្រាប់គ្រប់គ្រង និងតាមដានប្រតិបត្តិការទូទាត់ប្រកបដោយប្រសិទ្ធភាព',
                ],
                'thumbnail' => 'https://picsum.photos/seed/paymentcheckin/800/600',
                'demo_link' => null,
                'github_link' => null,
                'file_path' => 'https://drive.usercontent.google.com/download?id=1QOp-EkpLDr8zxTd0-LYhq9audjRcvhXe&export=download&confirm=t',
                'views_count' => 0,
                'downloads_count' => 0,
                'is_featured' => false,
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create($projectData);

            // Update slug
            $project->update(['slug' => Str::slug($projectData['title']['en'])]);
        }

        // Create project downloads for each project
        $users = User::where('role', 'visitor')->get();
        $allProjects = Project::all();

        $allProjects->each(function ($project) use ($users) {
            $downloadCount = rand(1, 5);
            for ($i = 0; $i < $downloadCount; $i++) {
                ProjectDownload::factory()->create([
                    'user_id' => $users->random()->id,
                    'project_id' => $project->id,
                    'ip_address' => fake()->ipv4(),
                ]);
            }
        });
    }
}