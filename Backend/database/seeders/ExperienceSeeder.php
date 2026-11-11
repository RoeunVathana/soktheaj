<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'job_title' => ['en' => 'Senior Full Stack Developer', 'kh' => 'អ្នកអភិវឌ្ឍន៍ពេញកម្រិតជាន់ខ្ពស់'],
                'company_name' => ['en' => 'Tech Solutions Inc.', 'kh' => 'ក្រុមហ៊ុន តេក សូលុយសិន'],
                'company_logo' => null,
                'location' => ['en' => 'Phnom Penh, Cambodia', 'kh' => 'ភ្នំពេញ, កម្ពុជា'],
                'description' => [
                    'en' => 'Led development of multiple web applications using Laravel and React. Managed a team of 5 developers and implemented CI/CD pipelines. Improved application performance by 40% through code optimization and caching strategies.',
                    'kh' => 'ដឹកនាំការអភិវឌ្ឍន៍កម្មវិធីបណ្តាញជាច្រើនដោយប្រើ Laravel និង React',
                ],
                'start_date' => '2022-03-01',
                'end_date' => null,
                'is_current' => true,
            ],
            [
                'job_title' => ['en' => 'Backend Developer', 'kh' => 'អ្នកអភិវឌ្ឍន៍ខាងក្រោយ'],
                'company_name' => ['en' => 'Digital Agency Co.', 'kh' => 'ក្រុមហ៊ុន ឌីជីថល អេហ្សង់ស៊ី'],
                'company_logo' => null,
                'location' => ['en' => 'Phnom Penh, Cambodia', 'kh' => 'ភ្នំពេញ, កម្ពុជា'],
                'description' => [
                    'en' => 'Developed RESTful APIs and microservices using Laravel and Node.js. Designed database schemas and implemented authentication and authorization systems.',
                    'kh' => 'បង្កើត RESTful APIs និង microservices ដោយប្រើ Laravel និង Node.js',
                ],
                'start_date' => '2020-06-01',
                'end_date' => '2022-02-28',
                'is_current' => false,
            ],
            [
                'job_title' => ['en' => 'Junior Web Developer', 'kh' => 'អ្នកអភិវឌ្ឍន៍វែបថ្នាក់ដំបូង'],
                'company_name' => ['en' => 'Startup Hub', 'kh' => 'ក្រុមហ៊ុន ស្តាតអាប់ ហាប់'],
                'company_logo' => null,
                'location' => ['en' => 'Phnom Penh, Cambodia', 'kh' => 'ភ្នំពេញ, កម្ពុជា'],
                'description' => [
                    'en' => 'Built and maintained front-end features using Vue.js and Tailwind CSS. Collaborated with design team to implement responsive UI components.',
                    'kh' => 'បង្កើត និងថែទាំមុខងារផ្នែកខាងមុខដោយប្រើ Vue.js និង Tailwind CSS',
                ],
                'start_date' => '2018-09-01',
                'end_date' => '2020-05-31',
                'is_current' => false,
            ],
            [
                'job_title' => ['en' => 'IT Intern', 'kh' => 'អ្នកហាត់ការផ្នែកព័ត៌មានវិទ្យា'],
                'company_name' => ['en' => 'Global Tech Corp', 'kh' => 'ក្រុមហ៊ុន គ្លោបល តេក ខប'],
                'company_logo' => null,
                'location' => ['en' => 'Phnom Penh, Cambodia', 'kh' => 'ភ្នំពេញ, កម្ពុជា'],
                'description' => [
                    'en' => 'Assisted in web development projects, learned PHP and MySQL, and contributed to internal tools development.',
                    'kh' => 'ជួយក្នុងគម្រោងអភិវឌ្ឍន៍វែប រៀន PHP និង MySQL',
                ],
                'start_date' => '2017-06-01',
                'end_date' => '2018-08-31',
                'is_current' => false,
            ],
            [
                'job_title' => ['en' => 'Freelance Web Developer', 'kh' => 'អ្នកអភិវឌ្ឍន៍វែបឯករាជ្យ'],
                'company_name' => ['en' => 'Self-Employed', 'kh' => 'អ្នកឯករាជ្យ'],
                'company_logo' => null,
                'location' => ['en' => 'Remote', 'kh' => 'ពីចម្ងាយ'],
                'description' => [
                    'en' => 'Developed custom websites and web applications for various clients. Worked with WordPress, Laravel, and React to deliver high-quality solutions.',
                    'kh' => 'បង្កើតគេហទំព័រផ្ទាល់ខ្លួន និងកម្មវិធីបណ្តាញសម្រាប់អតិថិជនផ្សេងៗ',
                ],
                'start_date' => '2016-01-01',
                'end_date' => '2017-05-31',
                'is_current' => false,
            ],
        ];

        foreach ($experiences as $expData) {
            Experience::create($expData);
        }
    }
}