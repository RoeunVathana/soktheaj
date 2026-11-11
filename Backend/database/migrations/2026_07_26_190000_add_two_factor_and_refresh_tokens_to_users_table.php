<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('google2fa_secret')
                ->after('remember_token')
                ->nullable();

            $table->boolean('two_factor_enabled')
                ->after('google2fa_secret')
                ->default(false);

            $table->text('two_factor_recovery_codes')
                ->after('two_factor_enabled')
                ->nullable();

            $table->timestamp('two_factor_confirmed_at')
                ->after('two_factor_recovery_codes')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'google2fa_secret',
                'two_factor_enabled',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
            ]);
        });
    }
};