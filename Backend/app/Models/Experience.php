<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Experience extends Model
{
    /** @use HasFactory<\Database\Factories\ExperienceFactory> */
    use HasFactory, HasTranslations;

    protected $fillable = [
        'job_title',
        'company_name',
        'company_logo',
        'location',
        'description',
        'start_date',
        'end_date',
        'is_current',
    ];

    public array $translatable = ['job_title', 'company_name', 'location', 'description'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
        ];
    }
}