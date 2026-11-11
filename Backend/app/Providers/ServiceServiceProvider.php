<?php

namespace App\Providers;

use App\Services\Api\V1\AchievementService;
use App\Services\Api\V1\AuthService;
use App\Services\Api\V1\EducationService;
use App\Services\Api\V1\ExperienceService;
use App\Services\Api\V1\MessageService;
use App\Services\Api\V1\PartnerService;
use App\Services\Api\V1\ProjectDownloadService;
use App\Services\Api\V1\ProjectService;
use App\Services\Api\V1\SkillService;
use App\Services\Api\V1\SocialService;
use App\Services\Api\V1\SoftwareApplicationService;
use App\Services\Contracts\AchievementServiceInterface;
use App\Services\Contracts\AuthServiceInterface;
use App\Services\Contracts\EducationServiceInterface;
use App\Services\Contracts\ExperienceServiceInterface;
use App\Services\Contracts\MessageServiceInterface;
use App\Services\Contracts\PartnerServiceInterface;
use App\Services\Contracts\ProjectDownloadServiceInterface;
use App\Services\Contracts\ProjectServiceInterface;
use App\Services\Contracts\SkillServiceInterface;
use App\Services\Contracts\SocialServiceInterface;
use App\Services\Contracts\SoftwareApplicationServiceInterface;
use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AchievementServiceInterface::class, AchievementService::class);
        $this->app->bind(ProjectServiceInterface::class, ProjectService::class);
        $this->app->bind(ProjectDownloadServiceInterface::class, ProjectDownloadService::class);
        $this->app->bind(ExperienceServiceInterface::class, ExperienceService::class);
        $this->app->bind(EducationServiceInterface::class, EducationService::class);
        $this->app->bind(PartnerServiceInterface::class, PartnerService::class);
        $this->app->bind(SkillServiceInterface::class, SkillService::class);
        $this->app->bind(MessageServiceInterface::class, MessageService::class);
        $this->app->bind(SocialServiceInterface::class, SocialService::class);
        $this->app->bind(SoftwareApplicationServiceInterface::class, SoftwareApplicationService::class);
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
    }

    public function boot(): void {}
}