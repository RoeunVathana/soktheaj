<?php

use Illuminate\Database\Migrations\Migration;

require_once __DIR__.'/Support/JsonbColumnMigration.php';

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'projects' => [
                'title' => false,
                'description' => true,
                'demo_link' => true,
                'github_link' => true,
            ],
            'experiences' => [
                'job_title' => false,
                'company_name' => false,
                'location' => true,
                'description' => true,
            ],
            'education' => [
                'degree' => false,
                'institution' => false,
                'field_of_study' => true,
                'description' => true,
            ],
            'skills' => ['name' => false],
            'partners' => ['name' => false, 'description' => true],
            'software_applications' => ['name' => false],
        ];

        foreach ($tables as $table => $columns) {
            JsonbColumnMigration::normalizeTranslations($table, array_keys($columns));
            JsonbColumnMigration::toJsonb($table, $columns);
        }
    }

    public function down(): void
    {
        $tables = [
            'projects' => [
                'title' => ['type' => 'string', 'nullable' => false, 'localized' => true],
                'description' => ['type' => 'text', 'nullable' => true, 'localized' => true],
                'demo_link' => ['type' => 'string', 'nullable' => true, 'localized' => true],
                'github_link' => ['type' => 'string', 'nullable' => true, 'localized' => true],
            ],
            'experiences' => [
                'job_title' => ['type' => 'string', 'nullable' => false, 'localized' => true],
                'company_name' => ['type' => 'string', 'nullable' => false, 'localized' => true],
                'location' => ['type' => 'string', 'nullable' => true, 'localized' => true],
                'description' => ['type' => 'text', 'nullable' => true, 'localized' => true],
            ],
            'education' => [
                'degree' => ['type' => 'string', 'nullable' => false, 'localized' => true],
                'institution' => ['type' => 'string', 'nullable' => false, 'localized' => true],
                'field_of_study' => ['type' => 'string', 'nullable' => true, 'localized' => true],
                'description' => ['type' => 'text', 'nullable' => true, 'localized' => true],
            ],
            'skills' => ['name' => ['type' => 'string', 'nullable' => false, 'localized' => true]],
            'partners' => [
                'name' => ['type' => 'string', 'nullable' => false, 'localized' => true],
                'description' => ['type' => 'text', 'nullable' => true, 'localized' => true],
            ],
            'software_applications' => ['name' => ['type' => 'string', 'nullable' => false, 'localized' => true]],
        ];

        foreach ($tables as $table => $columns) {
            JsonbColumnMigration::fromJsonb($table, $columns);
        }
    }
};
