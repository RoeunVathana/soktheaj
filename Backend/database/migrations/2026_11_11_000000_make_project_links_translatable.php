<?php

use Illuminate\Database\Migrations\Migration;

require_once __DIR__.'/Support/JsonbColumnMigration.php';

return new class extends Migration
{
    public function up(): void
    {
        $columns = ['demo_link' => true, 'github_link' => true];

        JsonbColumnMigration::normalizeTranslations('projects', array_keys($columns));
        JsonbColumnMigration::toJsonb('projects', $columns);
    }

    public function down(): void
    {
        JsonbColumnMigration::fromJsonb('projects', [
            'demo_link' => ['type' => 'string', 'nullable' => true, 'localized' => true],
            'github_link' => ['type' => 'string', 'nullable' => true, 'localized' => true],
        ]);
    }
};
