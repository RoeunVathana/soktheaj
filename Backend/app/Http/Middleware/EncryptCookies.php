<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

/**
 * EncryptCookies Middleware
 *
 * Controls which cookies are encrypted by Laravel's cookie encryption.
 *
 * The `refresh_token` cookie is excluded from encryption because it
 * contains a raw random string (the Sanctum refresh token) that is
 * stored as a SHA-256 hash in the database. Encrypting the cookie
 * value would corrupt the token comparison when the cookie is read
 * back via $request->cookie().
 *
 * Security Rationale:
 *  - The refresh_token is httpOnly (not accessible via JavaScript).
 *  - It's SameSite=Strict (protected against CSRF).
 *  - It's a random 80-character string (unguessable).
 *  - Excluding it from encryption does NOT weaken security because
 *    the cookie attributes (httpOnly, SameSite, Secure) provide the
 *    actual protection, not encryption.
 */
class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        'refresh_token',
    ];
}