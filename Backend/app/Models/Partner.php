<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Partner extends Model
{
    /** @use HasFactory<\Database\Factories\PartnerFactory> */
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name',
        'logo',
        'website_url',
        'description',
        'is_visible',
        'order',
    ];

    public array $translatable = ['name', 'description'];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}