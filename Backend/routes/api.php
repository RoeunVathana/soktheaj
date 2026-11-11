<?php

use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\EducationController;
use App\Http\Controllers\Api\V1\ExperienceController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\PartnerController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ProjectDownloadController;
use App\Http\Controllers\Api\V1\SkillController;
use App\Http\Controllers\Api\V1\SocialController;
use App\Http\Controllers\Api\V1\SoftwareApplicationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Enterprise-grade API routing with Defense-in-Depth authentication.
|
| Security Architecture:
|  - Access tokens (15-min TTL) → returned in JSON body, stored in React memory.
|  - Refresh tokens (7-day TTL) → httpOnly, SameSite=Strict cookies.
|  - Refresh endpoint reads cookies ONLY (not request body) to prevent XSS theft.
|  - Logout revokes ALL tokens and clears the cookie.
|
*/

Route::prefix('v1')->group(function () {

    // ──────────────────────────────────────────────
    //  Public Routes (No Authentication Required)
    // ──────────────────────────────────────────────

    // Profile (public - for displaying avatar on frontend)
    Route::get('/auth/profile', [AuthController::class, 'profile']);

    // ── Auth Routes (login, register, refresh, verify-otp) ──
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        // Token Refresh — reads httpOnly cookie (with request body fallback)
        Route::post('/refresh', [AuthController::class, 'refresh']);
        // Email OTP Verification
        Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    });

    // 2FA Verification (step-2 login, no auth required)
    Route::post('/2fa/verify', [AuthController::class, 'verifyTwoFactor']);

    // Password Reset
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/featured', [ProjectController::class, 'featured']);
    Route::get('/projects/slug/{slug}', [ProjectController::class, 'showBySlug']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);

    // Project Downloads
    Route::post('/projects/{project}/downloads', [ProjectDownloadController::class, 'store']);
    // Increment view count (public - called when a user views a project)
    Route::post('/projects/{project}/increment-view', [ProjectController::class, 'incrementView']);

    // ──────────────────────────────────────────────
    //  Download Count Increment (Authentication Required)
    // ──────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        // Increment download count — requires login (called when a logged-in user clicks Download)
        Route::post('/projects/{project}/increment-download', [ProjectController::class, 'incrementDownload']);
    });

    // Experiences
    Route::get('/experiences', [ExperienceController::class, 'index']);
    Route::get('/experiences/{experience}', [ExperienceController::class, 'show']);

    // Education
    Route::get('/education', [EducationController::class, 'index']);
    Route::get('/education/{education}', [EducationController::class, 'show']);

    // Partners
    Route::get('/partners', [PartnerController::class, 'index']);
    Route::get('/partners/visible', [PartnerController::class, 'visible']);
    Route::get('/partners/{partner}', [PartnerController::class, 'show']);

    // Skills
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/skills/{skill}', [SkillController::class, 'show']);

    // Software Applications
    Route::get('/software-applications', [SoftwareApplicationController::class, 'index']);
    Route::get('/software-applications/{softwareApplication}', [SoftwareApplicationController::class, 'show']);

    // Achievements
    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::get('/achievements/{achievement}', [AchievementController::class, 'show']);

    // Socials
    Route::get('/socials', [SocialController::class, 'index']);
    Route::get('/socials/visible', [SocialController::class, 'visible']);
    Route::get('/socials/{social}', [SocialController::class, 'show']);

    // ──────────────────────────────────────────────
    //  Authenticated Routes (Sanctum Required)
    // ──────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Messages (authenticated users only)
        Route::post('/messages', [MessageController::class, 'store']);

        // Profile Management (own account)
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::delete('/auth/profile', [AuthController::class, 'destroyProfile']);

        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Avatar Management
        Route::post('/auth/avatar/upload', [AuthController::class, 'uploadAvatar']);
        Route::post('/auth/avatar/upload-multiple', [AuthController::class, 'uploadAvatarsLegacy']);

        // 2FA Management (requires authentication)
        Route::post('/2fa/generate', [AuthController::class, 'generateTwoFactorSecret']);
        Route::post('/2fa/enable', [AuthController::class, 'enableTwoFactor']);

        // ──────────────────────────────────────────
        //  Admin-only CRUD Routes
        // ──────────────────────────────────────────
        Route::middleware('admin')->group(function () {
            // Dashboard Stats
            Route::get('/admin/dashboard-stats', [DashboardController::class, 'stats']);
            // Monthly Activity (real-time chart data — current year, up to now)
            Route::get('/admin/monthly-activity', [DashboardController::class, 'monthlyActivity']);

            // Users
            Route::get('/users', [UserController::class, 'index']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::patch('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);

            // Projects
            Route::post('/projects', [ProjectController::class, 'store']);
            Route::put('/projects/{project}', [ProjectController::class, 'update']);
            Route::patch('/projects/{project}', [ProjectController::class, 'update']);
            Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

            // Project Downloads
            Route::get('/downloads', [ProjectDownloadController::class, 'index']);
            Route::get('/downloads/{projectDownload}', [ProjectDownloadController::class, 'show']);
            Route::delete('/downloads/{projectDownload}', [ProjectDownloadController::class, 'destroy']);

            // Experiences
            Route::post('/experiences', [ExperienceController::class, 'store']);
            Route::put('/experiences/{experience}', [ExperienceController::class, 'update']);
            Route::patch('/experiences/{experience}', [ExperienceController::class, 'update']);
            Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy']);

            // Education
            Route::post('/education', [EducationController::class, 'store']);
            Route::put('/education/{education}', [EducationController::class, 'update']);
            Route::patch('/education/{education}', [EducationController::class, 'update']);
            Route::delete('/education/{education}', [EducationController::class, 'destroy']);

            // Partners
            Route::post('/partners', [PartnerController::class, 'store']);
            Route::put('/partners/{partner}', [PartnerController::class, 'update']);
            Route::patch('/partners/{partner}', [PartnerController::class, 'update']);
            Route::delete('/partners/{partner}', [PartnerController::class, 'destroy']);

            // Skills
            Route::post('/skills', [SkillController::class, 'store']);
            Route::put('/skills/{skill}', [SkillController::class, 'update']);
            Route::patch('/skills/{skill}', [SkillController::class, 'update']);
            Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

            // Software Applications
            Route::post('/software-applications', [SoftwareApplicationController::class, 'store']);
            Route::put('/software-applications/{softwareApplication}', [SoftwareApplicationController::class, 'update']);
            Route::patch('/software-applications/{softwareApplication}', [SoftwareApplicationController::class, 'update']);
            Route::delete('/software-applications/{softwareApplication}', [SoftwareApplicationController::class, 'destroy']);

            // Messages
            Route::get('/messages', [MessageController::class, 'index']);
            Route::get('/messages/{message}', [MessageController::class, 'show']);
            Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead']);
            Route::post('/messages/{message}/reply', [MessageController::class, 'reply']);
            Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

            // Achievements
            Route::post('/achievements', [AchievementController::class, 'store']);
            Route::put('/achievements/{achievement}', [AchievementController::class, 'update']);
            Route::patch('/achievements/{achievement}', [AchievementController::class, 'update']);
            Route::delete('/achievements/{achievement}', [AchievementController::class, 'destroy']);

            // Socials
            Route::post('/socials', [SocialController::class, 'store']);
            Route::put('/socials/{social}', [SocialController::class, 'update']);
            Route::patch('/socials/{social}', [SocialController::class, 'update']);
            Route::delete('/socials/{social}', [SocialController::class, 'destroy']);
        });
    });
});