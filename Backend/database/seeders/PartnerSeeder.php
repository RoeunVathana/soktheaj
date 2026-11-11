<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            [
                'name' => ['en' => 'Tech Solutions Inc.', 'kh' => 'ក្រុមហ៊ុន តេក សូលុយសិន'],
                'logo' => 'https://picsum.photos/seed/techsolutions/200/200',
                'website_url' => 'https://techsolutions.example.com',
                'description' => [
                    'en' => 'Leading technology solutions provider in Southeast Asia. Specializes in enterprise software development and cloud infrastructure.',
                    'kh' => 'អ្នកផ្តល់ដំណោះស្រាយបច្ចេកវិទ្យាឈានមុខគេនៅអាស៊ីអាគ្នេយ៍',
                ],
                'is_visible' => true,
                'order' => 1,
            ],
            [
                'name' => ['en' => 'Digital Agency Co.', 'kh' => 'ក្រុមហ៊ុន ឌីជីថល អេហ្សង់ស៊ី'],
                'logo' => 'https://picsum.photos/seed/digitalagency/200/200',
                'website_url' => 'https://digitalagency.example.com',
                'description' => [
                    'en' => 'Creative digital agency offering web design, branding, and digital marketing services to clients worldwide.',
                    'kh' => 'ទីភ្នាក់ងារឌីជីថលច្នៃប្រឌិត',
                ],
                'is_visible' => true,
                'order' => 2,
            ],
            [
                'name' => ['en' => 'Startup Hub Cambodia', 'kh' => 'ក្រុមហ៊ុន ស្តាតអាប់ ហាប់ កម្ពុជា'],
                'logo' => 'https://picsum.photos/seed/startuphub/200/200',
                'website_url' => 'https://startuphub-kh.example.com',
                'description' => [
                    'en' => 'Co-working space and startup incubator fostering innovation and entrepreneurship in Cambodia.',
                    'kh' => 'កន្លែងធ្វើការរួមគ្នា និងឧបត្ថម្ភអាជីវកម្មចាប់ផ្តើម',
                ],
                'is_visible' => true,
                'order' => 3,
            ],
            [
                'name' => ['en' => 'Global Tech Corp', 'kh' => 'ក្រុមហ៊ុន គ្លោបល តេក ខប'],
                'logo' => 'https://picsum.photos/seed/globaltech/200/200',
                'website_url' => 'https://globaltech.example.com',
                'description' => [
                    'en' => 'Multinational technology company with offices across Asia. Provides IT consulting and software development services.',
                    'kh' => 'ក្រុមហ៊ុនបច្ចេកវិទ្យាពហុជាតិ',
                ],
                'is_visible' => true,
                'order' => 4,
            ],
            [
                'name' => ['en' => 'WebDev Academy', 'kh' => 'សាលាបណ្តុះបណ្តាល WebDev'],
                'logo' => 'https://picsum.photos/seed/webdevacademy/200/200',
                'website_url' => 'https://webdevacademy.example.com',
                'description' => [
                    'en' => 'Online learning platform offering comprehensive web development courses and coding bootcamps.',
                    'kh' => 'វេទិកាសិក្សាតាមអ៊ីនធឺណិត',
                ],
                'is_visible' => true,
                'order' => 5,
            ],
            [
                'name' => ['en' => 'Open Source Community Cambodia', 'kh' => 'សហគមន៍កម្មវិធីប្រភពបើកចំហកម្ពុជា'],
                'logo' => 'https://picsum.photos/seed/opensourcekh/200/200',
                'website_url' => 'https://opensource-kh.example.com',
                'description' => [
                    'en' => 'Community organization promoting open source software and knowledge sharing among developers in Cambodia.',
                    'kh' => 'អង្គការសហគមន៍លើកកម្ពស់កម្មវិធីប្រភពបើកចំហ',
                ],
                'is_visible' => true,
                'order' => 6,
            ],
            [
                'name' => ['en' => 'CloudStack Technologies', 'kh' => 'ក្រុមហ៊ុន ក្លោដស្តាក តេកណូឡូជី'],
                'logo' => 'https://picsum.photos/seed/cloudstack/200/200',
                'website_url' => 'https://cloudstack.example.com',
                'description' => [
                    'en' => 'Cloud infrastructure and DevOps consulting company helping businesses migrate to modern cloud platforms.',
                    'kh' => 'ក្រុមហ៊ុនប្រឹក្សាហេដ្ឋារចនាសម្ព័ន្ធពពក',
                ],
                'is_visible' => false,
                'order' => 7,
            ],
            [
                'name' => ['en' => 'DesignStudio Pro', 'kh' => 'ក្រុមហ៊ុន ឌីហ្សាញស្ទូឌីយ៉ូ ប្រូ'],
                'logo' => 'https://picsum.photos/seed/designpro/200/200',
                'website_url' => 'https://designstudio-pro.example.com',
                'description' => [
                    'en' => 'Professional design studio specializing in UI/UX design, branding, and visual identity creation.',
                    'kh' => 'ស្ទូឌីយ៉ូរចនាប្រកបដោយវិជ្ជាជីវៈ',
                ],
                'is_visible' => true,
                'order' => 8,
            ],
        ];

        foreach ($partners as $partnerData) {
            Partner::create($partnerData);
        }
    }
}