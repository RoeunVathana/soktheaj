<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('title')->nullable()->after('name');
            $table->string('headline')->nullable()->after('title');
            $table->text('description')->nullable()->after('headline');
            $table->text('bio')->nullable()->after('description');
            $table->jsonb('contact')->nullable()->after('bio');
            $table->jsonb('socials')->nullable()->after('contact');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['title', 'headline', 'description', 'bio', 'contact', 'socials']);
        });
    }
};
