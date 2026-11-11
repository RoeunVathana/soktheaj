<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Social extends Model
{
    /** @use HasFactory<\Database\Factories\SocialFactory> */
    use HasFactory;

    protected $fillable = [
        'platform_name',
        'url',
        'icon',
        'is_visible',
        'order',
    ];

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