<?php

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 *
 * Enterprise-grade CORS settings for Defense-in-Depth security.
 *
 * Key Security Decisions:
 *  - allowed_origins: Strictly restricted to the React frontend origin.
 *    NEVER use '*' in production as it disables CORS credentials.
 *  - supports_credentials: true — Required for httpOnly cookies (refresh tokens).
 *  - allowed_headers: Restricted to essential headers to reduce attack surface.
 *  - exposed_headers: Empty — no custom headers are exposed to the browser.
 *
 * CSRF & Cookie Security:
 *  - With supports_credentials=true, the browser will only send cookies
 *    if the request origin matches allowed_origins.
 *  - Combined with SameSite=Strict on the refresh token cookie, this
 *    provides defense-in-depth against CSRF attacks.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Paths
    |--------------------------------------------------------------------------
    |
    | The paths that should be subject to CORS handling.
    | 'api/*' covers all API endpoints.
    | 'sanctum/csrf-cookie' is included for Sanctum SPA authentication.
    |
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
    |--------------------------------------------------------------------------
    | Allowed HTTP Methods
    |--------------------------------------------------------------------------
    |
    | Allow all standard HTTP methods.
    |
    */
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | RESTRICTED: Only allow the React frontend origin.
    | Never use '*' in production with credentials.
    |
    */
    'allowed_origins' => array_values(array_unique(array_filter([
        env('FRONTEND_URL', 'http://localhost:3000'),
        // Keep the Railway production frontend allowed even if Laravel's
        // config is cached before Railway injects service variables.
        'https://soktheaj-production.up.railway.app',
    ]))),

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins Patterns
    |--------------------------------------------------------------------------
    |
    | Regex patterns for dynamic origin matching (e.g., subdomains).
    | Leave empty if not needed.
    |
    */
    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Restrict to essential headers only.
    | Authorization: Required for Bearer token authentication.
    | Content-Type: Required for JSON and FormData requests.
    | Accept: Standard content negotiation header.
    | X-Requested-With: Required by some frontend frameworks.
    |
    */
    'allowed_headers' => [
        'Authorization',
        'Content-Type',
        'Accept',
        'X-Requested-With',
    ],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Headers that the browser is allowed to expose to JavaScript.
    | Keep empty to minimize information leakage.
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | How long (in seconds) the browser should cache the preflight response.
    | 86400 seconds = 24 hours reduces preflight requests for repeat calls.
    |
    */
    'max_age' => 86400,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | MUST be true for httpOnly cookie-based refresh token authentication.
    | When true, the browser will send cookies with cross-origin requests
    | IF the origin matches allowed_origins.
    |
    | WARNING: Setting this to true with allowed_origins=['*'] is a security
    | vulnerability. Always restrict allowed_origins to known origins.
    |
    */
    'supports_credentials' => true,

];
