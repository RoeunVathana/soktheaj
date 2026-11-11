<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    /** @use HasFactory<\Database\Factories\AchievementFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'company_logo',
        'school_logo',
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];
}