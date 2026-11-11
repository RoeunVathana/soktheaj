<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->jsonb('title');
            $table->string('slug')->unique();
            $table->jsonb('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->jsonb('demo_link')->nullable();
            $table->jsonb('github_link')->nullable();
            $table->string('file_path')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('downloads_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
