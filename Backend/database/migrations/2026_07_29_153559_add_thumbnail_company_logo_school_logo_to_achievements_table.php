<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('image');
            $table->string('company_logo')->nullable()->after('thumbnail');
            $table->string('school_logo')->nullable()->after('company_logo');
        });
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn(['thumbnail', 'company_logo', 'school_logo']);
        });
    }
};