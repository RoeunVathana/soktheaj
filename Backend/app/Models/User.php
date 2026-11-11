<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'avatars',
        'title',
        'headline',
        'description',
        'bio',
        'contact',
        'socials',
        'google2fa_secret',
        'two_factor_enabled',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'google2fa_secret' => 'encrypted',
            'two_factor_enabled' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
            'avatars' => 'array',
            'contact' => 'array',
            'socials' => 'array',
            'is_verified' => 'boolean',
            'title' => 'array',
            'headline' => 'array',
            'description' => 'array',
            'bio' => 'array',
        ];
    }

    public function projectDownloads(): HasMany
    {
        return $this->hasMany(ProjectDownload::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function hasTwoFactorEnabled(): bool
    {
        return $this->two_factor_enabled && $this->google2fa_secret !== null;
    }

    public function recoveryCodes(): array
    {
        return $this->two_factor_recovery_codes
            ? json_decode($this->two_factor_recovery_codes, true)
            : [];
    }

    public function setRecoveryCodes(array $codes): void
    {
        $this->two_factor_recovery_codes = json_encode($codes);
        $this->save();
    }
}