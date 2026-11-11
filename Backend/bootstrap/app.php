<?php

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin'    => \App\Http\Middleware\AdminMiddleware::class,
            'security' => \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        $middleware->api(prepend: [
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \App\Http\Middleware\SetLocaleMiddleware::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        // Exclude refresh_token from cookie encryption so the raw token string
        // can be properly read by the API and compared to the SHA-256 hash
        // stored in the personal_access_tokens table.
        $middleware->encryptCookies(except: [
            'refresh_token',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
