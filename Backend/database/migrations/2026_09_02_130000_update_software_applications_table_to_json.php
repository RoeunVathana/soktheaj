<?php

use Illuminate\Database\Migrations\Migration;

require_once __DIR__.'/Support/JsonbColumnMigration.php';

return new class extends Migration
{
    public function up(): void
    {
        JsonbColumnMigration::normalizeTranslations('software_applications', ['name', 'description']);
        JsonbColumnMigration::toJsonb('software_applications', ['name' => false, 'description' => true]);
    }

    public function down(): void
    {
        JsonbColumnMigration::fromJsonb('software_applications', [
            'name' => ['type' => 'string', 'nullable' => false, 'localized' => true],
            'description' => ['type' => 'text', 'nullable' => true, 'localized' => true],
        ]);
    }
};
