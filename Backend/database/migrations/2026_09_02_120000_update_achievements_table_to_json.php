<?php

use Illuminate\Database\Migrations\Migration;

require_once __DIR__.'/Support/JsonbColumnMigration.php';

return new class extends Migration
{
    public function up(): void
    {
        JsonbColumnMigration::normalizeTranslations('achievements', ['title', 'description']);
        JsonbColumnMigration::toJsonb('achievements', ['title' => false, 'description' => false]);
    }

    public function down(): void
    {
        JsonbColumnMigration::fromJsonb('achievements', [
            'title' => ['type' => 'string', 'nullable' => false, 'localized' => true],
            'description' => ['type' => 'text', 'nullable' => false, 'localized' => true],
        ]);
    }
};
