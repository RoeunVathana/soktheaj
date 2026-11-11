<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->nullable()->constrained()->nullOnDelete();
            $table->string('phone', 50)->after('sender_email')->nullable();
            $table->timestamp('last_sent_at')->nullable()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'phone', 'last_sent_at']);
        });
    }
};