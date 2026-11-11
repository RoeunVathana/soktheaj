<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('Accept-Language', 'en');

        $supportedLocales = ['en', 'kh'];

        if (! in_array($locale, $supportedLocales)) {
            $locale = 'en';
        }

        app()->setLocale($locale);

        return $next($request);
    }
}