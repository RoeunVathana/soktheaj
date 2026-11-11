<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Change avatar from string (single) to json (multiple images)
            $table->jsonb('avatars')->nullable()->after('role');
        });

        DB::table('users')
            ->select(['id', 'avatar'])
            ->whereNotNull('avatar')
            ->where('avatar', '<>', '')
            ->orderBy('id')
            ->chunkById(100, function ($users): void {
                foreach ($users as $user) {
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['avatars' => json_encode([$user->avatar], JSON_THROW_ON_ERROR)]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatars');
        });
    }
};
