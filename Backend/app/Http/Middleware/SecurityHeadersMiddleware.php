<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * SecurityHeadersMiddleware
 *
 * Injects strict security headers into every HTTP response to enforce
 * Defense-in-Depth browser-level protections against XSS, clickjacking,
 * MIME-type sniffing, and data injection attacks.
 *
 * Key Security Headers:
 *  - Content-Security-Policy (CSP): Restricts resources to trusted origins only.
 *  - X-Frame-Options: DENY — prevents clickjacking by blocking iframe embedding.
 *  - X-Content-Type-Options: nosniff — forces browser to honor declared MIME types.
 *  - Referrer-Policy: strict-origin-when-cross-origin — limits referrer leakage.
 *  - Permissions-Policy: disables unused browser features (camera, mic, etc.).
 *  - Strict-Transport-Security (HSTS): enforces HTTPS (production only).
 */
class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request and attach security headers.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // ──────────────────────────────────────────────
        // 1. Content-Security-Policy (CSP)
        //    Restricts script/style/connect sources to prevent XSS.
        //    'unsafe-inline' for styles is required by many UI frameworks (Tailwind, etc.).
        //    connect-src allows the API backend and frontend dev server.
        // ──────────────────────────────────────────────
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; " .
            "script-src 'self'; " .
            "style-src 'self' 'unsafe-inline'; " .
            "connect-src 'self' http://localhost:8000 http://localhost:3000 http://localhost:5173; " .
            "img-src 'self' data:; " .
            "font-src 'self'; " .
            "object-src 'none'; " .
            "frame-ancestors 'none';"
        );

        // ──────────────────────────────────────────────
        // 2. X-Frame-Options: DENY
        //    Prevents clickjacking by disallowing iframe embedding.
        // ──────────────────────────────────────────────
        $response->headers->set('X-Frame-Options', 'DENY');

        // ──────────────────────────────────────────────
        // 3. X-Content-Type-Options: nosniff
        //    Prevents MIME-type sniffing (e.g., forcing a script to be
        //    treated as a different content type).
        // ──────────────────────────────────────────────
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // ──────────────────────────────────────────────
        // 4. Referrer-Policy: strict-origin-when-cross-origin
        //    Sends full URL as referrer only for same-origin requests;
        //    sends only origin for cross-origin; omits for HTTPS→HTTP.
        // ──────────────────────────────────────────────
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // ──────────────────────────────────────────────
        // 5. Permissions-Policy
        //    Disables unused browser features to reduce attack surface.
        // ──────────────────────────────────────────────
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), interest-cohort=()'
        );

        // ──────────────────────────────────────────────
        // 6. Strict-Transport-Security (HSTS)
        //    Enforces HTTPS for 1 year. Only enabled in production.
        //    'includeSubDomains' ensures all subdomains are also HTTPS.
        // ──────────────────────────────────────────────
        if (app()->environment('production')) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
        }

        return $response;
    }
}