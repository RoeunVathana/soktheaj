<?php

use Illuminate\Database\Migrations\Migration;

require_once __DIR__.'/Support/JsonbColumnMigration.php';

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $columns = ['title', 'headline', 'description', 'bio', 'avatars', 'contact', 'socials'];
        JsonbColumnMigration::normalizeTranslations('users', ['title', 'headline', 'description', 'bio']);
        JsonbColumnMigration::toJsonb('users', array_fill_keys($columns, true));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        JsonbColumnMigration::fromJsonb('users', [
            'title' => ['type' => 'string', 'length' => 255, 'nullable' => true, 'localized' => true],
            'headline' => ['type' => 'string', 'length' => 255, 'nullable' => true, 'localized' => true],
            'description' => ['type' => 'text', 'nullable' => true, 'localized' => true],
            'bio' => ['type' => 'text', 'nullable' => true, 'localized' => true],
            'avatars' => ['type' => 'text', 'nullable' => true],
            'contact' => ['type' => 'text', 'nullable' => true],
            'socials' => ['type' => 'text', 'nullable' => true],
        ]);
    }
};
