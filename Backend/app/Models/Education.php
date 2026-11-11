<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Education extends Model
{
    /** @use HasFactory<\Database\Factories\EducationFactory> */
    use HasFactory, HasTranslations;

    protected $fillable = [
        'degree',
        'institution',
        'school_logo',
        'field_of_study',
        'description',
        'start_date',
        'end_date',
    ];

    public array $translatable = ['degree', 'institution', 'field_of_study', 'description'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}