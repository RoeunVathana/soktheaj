<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Skill extends Model
{
    /** @use HasFactory<\Database\Factories\SkillFactory> */
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name',
        'icon',
        'proficiency',
        'category',
    ];

    public array $translatable = ['name'];

    protected function casts(): array
    {
        return [
            'proficiency' => 'integer',
        ];
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}