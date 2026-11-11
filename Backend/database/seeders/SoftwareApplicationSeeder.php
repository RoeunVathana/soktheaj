<?php

namespace Database\Seeders;

use App\Models\SoftwareApplication;
use Illuminate\Database\Seeder;

class SoftwareApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $applications = [
            [
                'name' => ['en' => 'VS Code', 'kh' => 'វីអេស កូដ'],
                'icon' => 'vscode-icon',
                'type' => 'IDE',
                'category' => 'Development',
                'platform' => 'Windows, macOS, Linux',
                'description' => [
                    'en' => 'A lightweight source-code editor with debugging and extension support.',
                    'kh' => 'កម្មវិធីកែសម្រួលកូដដែលមានទម្ងន់ស្រាល និងគាំទ្រការបំបាត់កំហុស ព្រមទាំង Extension។',
                ],
                'url' => 'https://code.visualstudio.com/',
            ],
            [
                'name' => ['en' => 'PhpStorm', 'kh' => 'ភីភីស្តម'],
                'icon' => 'phpstorm-icon',
                'type' => 'IDE',
                'category' => 'Development',
                'platform' => 'Windows, macOS, Linux',
                'description' => [
                    'en' => 'An IDE for PHP development by JetBrains.',
                    'kh' => 'កម្មវិធី IDE សម្រាប់អភិវឌ្ឍន៍ PHP របស់ JetBrains។',
                ],
                'url' => 'https://www.jetbrains.com/phpstorm/',
            ],
            [
                'name' => ['en' => 'Postman', 'kh' => 'ប៉ុស្តមែន'],
                'icon' => 'postman-icon',
                'type' => 'API Testing',
                'category' => 'Development',
                'platform' => 'Windows, macOS, Linux, Web',
                'description' => [
                    'en' => 'A platform for building, testing, and documenting APIs.',
                    'kh' => 'វេទិកាសម្រាប់បង្កើត សាកល្បង និងចងក្រងឯកសារ API។',
                ],
                'url' => 'https://www.postman.com/',
            ],
            [
                'name' => ['en' => 'Figma', 'kh' => 'ហ្វីកម៉ា'],
                'icon' => 'figma-icon',
                'type' => 'Design',
                'category' => 'Design',
                'platform' => 'Web, Windows, macOS',
                'description' => [
                    'en' => 'A collaborative interface-design and prototyping tool.',
                    'kh' => 'ឧបករណ៍រចនា Interface និងបង្កើត Prototype ដែលអាចសហការគ្នាបាន។',
                ],
                'url' => 'https://www.figma.com/',
            ],
            [
                'name' => ['en' => 'Git', 'kh' => 'ហ្គីត'],
                'icon' => 'git-icon',
                'type' => 'Version Control',
                'category' => 'Development',
                'platform' => 'Windows, macOS, Linux',
                'description' => [
                    'en' => 'A distributed version-control system for tracking source-code changes.',
                    'kh' => 'ប្រព័ន្ធគ្រប់គ្រងកំណែបែបចែកចាយ សម្រាប់តាមដានការផ្លាស់ប្តូរកូដ។',
                ],
                'url' => 'https://git-scm.com/',
            ],
            [
                'name' => ['en' => 'Docker Desktop', 'kh' => 'ដុកឃ័រ ដេសថប'],
                'icon' => 'docker-icon',
                'type' => 'DevOps',
                'category' => 'DevOps',
                'platform' => 'Windows, macOS, Linux',
                'description' => [
                    'en' => 'A desktop application for building and running containerized applications.',
                    'kh' => 'កម្មវិធី Desktop សម្រាប់បង្កើត និងដំណើរការកម្មវិធីក្នុង Container។',
                ],
                'url' => 'https://www.docker.com/products/docker-desktop/',
            ],
            [
                'name' => ['en' => 'TablePlus', 'kh' => 'តេបផ្លាស'],
                'icon' => 'tableplus-icon',
                'type' => 'Database',
                'category' => 'Database',
                'platform' => 'Windows, macOS, Linux',
                'description' => [
                    'en' => 'A database-management application with a native interface.',
                    'kh' => 'កម្មវិធីគ្រប់គ្រង Database ដែលមាន Interface ដើម។',
                ],
                'url' => 'https://tableplus.com/',
            ],
            [
                'name' => ['en' => 'Notion', 'kh' => 'ណូសិន'],
                'icon' => 'notion-icon',
                'type' => 'Productivity',
                'category' => 'Productivity',
                'platform' => 'Web, Windows, macOS, iOS, Android',
                'description' => [
                    'en' => 'A workspace for notes, documents, and team knowledge.',
                    'kh' => 'Workspace សម្រាប់កំណត់ចំណាំ ឯកសារ និងចំណេះដឹងក្រុម។',
                ],
                'url' => 'https://www.notion.so/',
            ],
            [
                'name' => ['en' => 'Slack', 'kh' => 'ស្លាក'],
                'icon' => 'slack-icon',
                'type' => 'Communication',
                'category' => 'Communication',
                'platform' => 'Web, Windows, macOS, iOS, Android',
                'description' => [
                    'en' => 'A messaging platform for team communication and collaboration.',
                    'kh' => 'វេទិកាផ្ញើសារសម្រាប់ការទំនាក់ទំនង និងសហការក្នុងក្រុម។',
                ],
                'url' => 'https://slack.com/',
            ],
            [
                'name' => ['en' => 'Photoshop', 'kh' => 'ហ្វូតូសុប'],
                'icon' => 'photoshop-icon',
                'type' => 'Design',
                'category' => 'Design',
                'platform' => 'Windows, macOS, Web, iPad',
                'description' => [
                    'en' => 'An image-editing and digital-art application by Adobe.',
                    'kh' => 'កម្មវិធីកែរូបភាព និងបង្កើតសិល្បៈឌីជីថលរបស់ Adobe។',
                ],
                'url' => 'https://www.adobe.com/products/photoshop.html',
            ],
            [
                'name' => ['en' => 'SourceTree', 'kh' => 'សូរសឺត្រី'],
                'icon' => 'sourcetree-icon',
                'type' => 'Version Control',
                'category' => 'Development',
                'platform' => 'Windows, macOS',
                'description' => [
                    'en' => 'A graphical Git client for managing repositories.',
                    'kh' => 'កម្មវិធី Git មានក្រាហ្វិកសម្រាប់គ្រប់គ្រង Repository។',
                ],
                'url' => 'https://www.sourcetreeapp.com/',
            ],
            [
                'name' => ['en' => 'HeidiSQL', 'kh' => 'ហេឌីអេសឃ្យូអិល'],
                'icon' => 'heidisql-icon',
                'type' => 'Database',
                'category' => 'Database',
                'platform' => 'Windows',
                'description' => [
                    'en' => 'A client for managing MySQL, MariaDB, PostgreSQL, and other databases.',
                    'kh' => 'កម្មវិធី Client សម្រាប់គ្រប់គ្រង MySQL, MariaDB, PostgreSQL និង Database ផ្សេងៗ។',
                ],
                'url' => 'https://www.heidisql.com/',
            ],
        ];

        foreach ($applications as $appData) {
            SoftwareApplication::updateOrCreate(
                ['icon' => $appData['icon']],
                $appData
            );
        }
    }
}
