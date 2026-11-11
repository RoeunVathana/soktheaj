<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Translatable\HasTranslations;

class SoftwareApplication extends Model
{
    /** @use HasFactory<\Database\Factories\SoftwareApplicationFactory> */
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name',
        'icon',
        'type',
        'category',
        'platform',
        'description',
        'url',
    ];

    public array $translatable = ['name', 'description'];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    /**
     * The projects that use this software application.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_software_application');
    }
}
