<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, HasTranslations;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'thumbnail',
        'demo_link',
        'github_link',
        'file_path',
        'views_count',
        'downloads_count',
        'is_featured',
    ];

    public array $translatable = ['title', 'description', 'demo_link', 'github_link'];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'views_count' => 'integer',
            'downloads_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->getTranslation('title', 'en'));
            }
        });
    }

    public function downloads(): HasMany
    {
        return $this->hasMany(ProjectDownload::class);
    }

    /**
     * The software applications (technologies/tools) used in this project.
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(SoftwareApplication::class, 'project_software_application');
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementDownloads(): void
    {
        $this->increment('downloads_count');
    }
}
