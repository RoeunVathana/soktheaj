<?php

namespace App\Providers;

use App\Repositories\Api\V1\AchievementRepository;
use App\Repositories\Api\V1\EducationRepository;
use App\Repositories\Api\V1\ExperienceRepository;
use App\Repositories\Api\V1\MessageRepository;
use App\Repositories\Api\V1\PartnerRepository;
use App\Repositories\Api\V1\ProjectDownloadRepository;
use App\Repositories\Api\V1\ProjectRepository;
use App\Repositories\Api\V1\SkillRepository;
use App\Repositories\Api\V1\SocialRepository;
use App\Repositories\Api\V1\SoftwareApplicationRepository;
use App\Repositories\Api\V1\UserRepository;
use App\Repositories\Contracts\AchievementRepositoryInterface;
use App\Repositories\Contracts\EducationRepositoryInterface;
use App\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Repositories\Contracts\MessageRepositoryInterface;
use App\Repositories\Contracts\PartnerRepositoryInterface;
use App\Repositories\Contracts\ProjectDownloadRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Repositories\Contracts\SocialRepositoryInterface;
use App\Repositories\Contracts\SoftwareApplicationRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AchievementRepositoryInterface::class, AchievementRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(ProjectDownloadRepositoryInterface::class, ProjectDownloadRepository::class);
        $this->app->bind(ExperienceRepositoryInterface::class, ExperienceRepository::class);
        $this->app->bind(EducationRepositoryInterface::class, EducationRepository::class);
        $this->app->bind(PartnerRepositoryInterface::class, PartnerRepository::class);
        $this->app->bind(SkillRepositoryInterface::class, SkillRepository::class);
        $this->app->bind(MessageRepositoryInterface::class, MessageRepository::class);
        $this->app->bind(SocialRepositoryInterface::class, SocialRepository::class);
        $this->app->bind(SoftwareApplicationRepositoryInterface::class, SoftwareApplicationRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    public function boot(): void {}
}