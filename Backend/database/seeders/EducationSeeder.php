<?php

namespace Database\Seeders;

use App\Models\Education;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        $educations = [
            [
                'degree' => ['en' => 'Master of Science in Computer Science', 'kh' => 'បរិញ្ញាប័ត្រជាន់ខ្ពស់ផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រ'],
                'institution' => ['en' => 'Royal University of Phnom Penh', 'kh' => 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ'],
                'school_logo' => null,
                'field_of_study' => ['en' => 'Computer Science', 'kh' => 'វិទ្យាសាស្ត្រកុំព្យូទ័រ'],
                'description' => [
                    'en' => 'Focused on advanced algorithms, machine learning, and software architecture. Thesis on distributed systems and microservices architecture.',
                    'kh' => 'ផ្តោតលើក្បួនដោះស្រាយកម្រិតខ្ពស់ ការរៀនម៉ាស៊ីន និងស្ថាបត្យកម្មកម្មវិធី',
                ],
                'start_date' => '2020-10-01',
                'end_date' => '2022-07-31',
            ],
            [
                'degree' => ['en' => 'Bachelor of Science in Software Engineering', 'kh' => 'បរិញ្ញាប័ត្រវិទ្យាសាស្ត្រផ្នែកវិស្វកម្មកម្មវិធី'],
                'institution' => ['en' => 'Institute of Technology of Cambodia', 'kh' => 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា'],
                'school_logo' => null,
                'field_of_study' => ['en' => 'Software Engineering', 'kh' => 'វិស្វកម្មកម្មវិធី'],
                'description' => [
                    'en' => 'Graduated with honors. Studied software development methodologies, database design, web technologies, and project management.',
                    'kh' => 'បញ្ចប់ការសិក្សាដោយពិន្ទុល្អ',
                ],
                'start_date' => '2016-10-01',
                'end_date' => '2020-07-31',
            ],
            [
                'degree' => ['en' => 'Associate Degree in Information Technology', 'kh' => 'សញ្ញាប័ត្ររងផ្នែកព័ត៌មានវិទ្យា'],
                'institution' => ['en' => 'National Polytechnic Institute of Cambodia', 'kh' => 'វិទ្យាស្ថានជាតិពហុបច្ចេកទេសកម្ពុជា'],
                'school_logo' => null,
                'field_of_study' => ['en' => 'Information Technology', 'kh' => 'ព័ត៌មានវិទ្យា'],
                'description' => [
                    'en' => 'Foundation in computer science, networking, and programming fundamentals. Developed first web applications using PHP and MySQL.',
                    'kh' => 'មូលដ្ឋានគ្រឹះក្នុងវិទ្យាសាស្ត្រកុំព្យូទ័រ បណ្តាញ និងកម្មវិធី',
                ],
                'start_date' => '2014-10-01',
                'end_date' => '2016-07-31',
            ],
            [
                'degree' => ['en' => 'High School Diploma', 'kh' => 'សញ្ញាប័ត្រមធ្យមសិក្សាទុតិយភូមិ'],
                'institution' => ['en' => 'Chak Angre High School', 'kh' => 'វិទ្យាល័យចក្រអង្គរ'],
                'school_logo' => null,
                'field_of_study' => ['en' => 'General Education', 'kh' => 'ការអប់រំទូទៅ'],
                'description' => [
                    'en' => 'Graduated with excellent grades in mathematics and science. Participated in national programming competitions.',
                    'kh' => 'បញ្ចប់ការសិក្សាដោយពិន្ទុល្អផ្នែកគណិតវិទ្យា និងវិទ្យាសាស្ត្រ',
                ],
                'start_date' => '2012-10-01',
                'end_date' => '2014-08-31',
            ],
        ];

        foreach ($educations as $eduData) {
            Education::create($eduData);
        }
    }
}