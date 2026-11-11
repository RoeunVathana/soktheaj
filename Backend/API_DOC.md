# Portfolio API Documentation

**Base URL:** `http://localhost:8000/api/v1`

**Content-Type:** `application/json`

## Multi-language Support

This API supports English (`en`) and Khmer (`kh`) languages via the `Accept-Language` header.

- **Header:** `Accept-Language: en` or `Accept-Language: kh`
- **Default:** `en` if header is missing or unsupported
- Translatable fields accept JSON objects with locale keys: `{"en": "English", "kh": "ភាសាខ្មែរ"}`
- Responses return translated values based on the `Accept-Language` header

---

## Authentication (Sanctum with Refresh Tokens)

The API uses **Laravel Sanctum** for authentication with a dual-token strategy:
- **Access Token** (short-lived, 15 minutes): Returned in the JSON response body as `access_token`. Used in the `Authorization: Bearer {token}` header for API requests.
- **Refresh Token** (long-lived, 7 days): Stored in a secure **HttpOnly Cookie** (`refresh_token`). Used to obtain new access tokens without re-authentication.

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (returns access_token + sets refresh_token cookie) |
| POST | `/auth/login` | Login user (returns access_token + sets refresh_token cookie) |
| POST | `/auth/refresh-token` | Refresh access_token using HttpOnly cookie |

### Protected Routes (auth:sanctum)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/logout` | Logout user (revokes tokens + clears cookie) |
| GET | `/auth/user` | Get authenticated user |

---

## Authentication Endpoints

### POST /auth/register

Register a new user. Returns an access token and sets a refresh token as an HttpOnly cookie.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user",
            "avatar": null,
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        },
        "access_token": "1|abc123...",
        "token_type": "Bearer",
        "expires_in": 900
    }
}
```

**Set-Cookie:** `refresh_token={token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`

### POST /auth/login

Authenticates user credentials. If 2FA is enabled, returns a `two_factor_token` for step-2 verification instead of tokens.

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200) - Without 2FA:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": { "id": 1, "name": "John Doe", "role": "admin", ... },
        "access_token": "1|abc123...",
        "token_type": "Bearer",
        "expires_in": 900
    }
}
```

**Set-Cookie:** `refresh_token={token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`

**Response (200) - With 2FA Enabled:**
```json
{
    "success": true,
    "message": "2FA verification is required to complete login.",
    "data": {
        "two_factor_required": true,
        "user_email": "john@example.com"
    }
}
```

### POST /auth/refresh-token

Reads the `refresh_token` from the HttpOnly cookie, validates it, and returns a fresh access token. No request body needed.

**Response (200):**
```json
{
    "success": true,
    "message": "Token refreshed successfully.",
    "data": {
        "access_token": "2|def456...",
        "token_type": "Bearer",
        "expires_in": 900
    }
}
```

**Set-Cookie:** `refresh_token={new_token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`

**Error Response (401):**
```json
{
    "success": false,
    "message": "Invalid or expired refresh token."
}
```

### POST /auth/logout

**Headers:** `Authorization: Bearer {token}`

Revokes the current access token and clears the refresh token cookie.

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### GET /auth/user

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin",
        "avatar": null,
        "two_factor_enabled": false,
        "created_at": "2026-07-26T12:00:00.000000Z",
        "updated_at": "2026-07-26T12:00:00.000000Z"
    }
}
```

---

## Multi-Factor Authentication (2FA / TOTP)

The API supports Time-based One-Time Password (TOTP) authentication using the `pragmarx/google2fa-laravel` package. Compatible with Google Authenticator, Authy, and similar apps. The `google2fa_secret` is encrypted at rest in the database using Laravel's `encrypted` cast.

### 2FA Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/2fa/generate` | Sanctum | Generate QR code / secret key for setup |
| POST | `/2fa/enable` | Sanctum | Validate OTP and enable 2FA |
| POST | `/2fa/verify` | Public | Step-2 login verification (OTP or recovery code) |

---

### POST /2fa/generate

**Headers:** `Authorization: Bearer {token}`

Generates a new 2FA secret key and QR code URL. The secret is stored encrypted on the user's account but 2FA is not yet enabled. Works for any authenticated user (Admin or Visitor).

**Response (200):**
```json
{
    "success": true,
    "message": "2FA secret generated. Scan the QR code with your authenticator app.",
    "data": {
        "secret": "JBSWY3DPEHPK3PXP",
        "qr_code_url": "otpauth://totp/Laravel:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Laravel"
    }
}
```

### POST /2fa/enable

**Headers:** `Authorization: Bearer {token}`

Validates the OTP code from the authenticator app and enables 2FA. On success, returns 8 recovery codes (save them securely — they are shown only once).

**Request Body:**
```json
{
    "otp": "123456"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "2FA has been enabled successfully.",
    "data": {
        "recovery_codes": [
            "abc123def4-5678ghijkl",
            "mnopqrstuv-wxyz123456",
            "..."
        ]
    }
}
```

**Error Response (400 - Secret not generated):**
```json
{
    "success": false,
    "message": "Generate a 2FA secret first using /2fa/generate."
}
```

**Error Response (400 - Already enabled):**
```json
{
    "success": false,
    "message": "2FA is already enabled for this account."
}
```

**Error Response (422 - Invalid OTP):**
```json
{
    "success": false,
    "message": "Invalid OTP code. Please try again."
}
```

### POST /2fa/verify

Step-2 login verification. Used after `/auth/login` returns `two_factor_required: true`. Accepts either an OTP code or a recovery code along with the user's email.

**Request Body (OTP):**
```json
{
    "email": "john@example.com",
    "otp": "123456"
}
```

**Request Body (Recovery Code):**
```json
{
    "email": "john@example.com",
    "recovery_code": "abc123def4-5678ghijkl"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": { "id": 1, "name": "John Doe", "role": "admin", "two_factor_enabled": true, ... },
        "access_token": "3|ghi789...",
        "token_type": "Bearer",
        "expires_in": 900
    }
}
```

**Set-Cookie:** `refresh_token={token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid user or 2FA is not enabled for this account."
}
```

**Error Response (422 - Invalid OTP):**
```json
{
    "success": false,
    "message": "Invalid OTP code."
}
```

**Error Response (422 - Invalid Recovery Code):**
```json
{
    "success": false,
    "message": "Invalid recovery code."
}
```

---

## Password Reset

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/forgot-password` | Request password reset link (returns token) |
| POST | `/reset-password` | Reset password using token |

---

### POST /forgot-password

Request a password reset token.

**Request Body:**
```json
{
    "email": "admin@example.com"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Password reset link has been sent to your email.",
    "data": {
        "token": "abc123def456ghi789..."
    }
}
```

**Error Response (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The selected email is invalid."]
    }
}
```

### POST /reset-password

Reset password using the token received from forgot-password.

**Request Body:**
```json
{
    "email": "admin@example.com",
    "token": "abc123def456ghi789...",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Password has been reset successfully."
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid or expired token."
}
```

---

## Projects

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects (supports pagination, search, featured filter) |
| GET | `/projects/featured` | List featured projects |
| GET | `/projects/slug/{slug}` | Get project by slug |
| GET | `/projects/{project}` | Get project by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| PUT/PATCH | `/projects/{project}` | Update project |
| DELETE | `/projects/{project}` | Delete project |

---

### GET /projects

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `per_page` | int | Items per page (default: 12) |
| `search` | string | Search by title/description |
| `featured` | bool | Filter featured projects only |

**Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "title": "Portfolio Website",
            "slug": "portfolio-website",
            "description": "A personal portfolio built with Laravel",
            "thumbnail": "thumbnails/project1.jpg",
            "demo_link": "https://example.com/demo",
            "github_link": "https://github.com/user/repo",
            "file_path": "files/project1.zip",
            "views_count": 150,
            "downloads_count": 25,
            "is_featured": true,
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 12,
        "total": 50
    }
}
```

### POST /projects (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "title": {
        "en": "Portfolio Website",
        "kh": "គេហទំព័រផតថូហ្វូល"
    },
    "slug": "portfolio-website",
    "description": {
        "en": "A personal portfolio website built with Laravel",
        "kh": "គេហទំព័រផតថូហ្វូលផ្ទាល់ខ្លួនបង្កើតដោយ Laravel"
    },
    "thumbnail": "thumbnails/project1.jpg",
    "demo_link": "https://example.com/demo",
    "github_link": "https://github.com/user/repo",
    "file_path": "files/project1.zip",
    "is_featured": true
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Project created successfully",
    "data": {
        "id": 1,
        "title": "Portfolio Website",
        "slug": "portfolio-website",
        "description": "A personal portfolio website built with Laravel",
        ...
    }
}
```

### PUT/PATCH /projects/{project} (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "title": {
        "en": "Updated Portfolio",
        "kh": "ផតថូហ្វូលដែលបានធ្វើបច្ចុប្បន្នភាព"
    },
    "description": {
        "en": "Updated description",
        "kh": "ការពិពណ៌នាដែលបានធ្វើបច្ចុប្បន្នភាព"
    }
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Project updated successfully",
    "data": { ... }
}
```

### DELETE /projects/{project} (Admin)

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
    "success": true,
    "message": "Project deleted successfully"
}
```

---

## Experiences

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/experiences` | List all experiences |
| GET | `/experiences/{experience}` | Get experience by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/experiences` | Create experience |
| PUT/PATCH | `/experiences/{experience}` | Update experience |
| DELETE | `/experiences/{experience}` | Delete experience |

---

### GET /experiences

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "job_title": "Software Engineer",
            "company_name": "Tech Corp",
            "company_logo": "logos/tech.png",
            "location": "Phnom Penh",
            "description": "Developed web applications using Laravel",
            "start_date": "2024-01-01",
            "end_date": null,
            "is_current": true,
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ]
}
```

### POST /experiences (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "job_title": {
        "en": "Software Engineer",
        "kh": "វិស្វករផ្នែកទន់"
    },
    "company_name": {
        "en": "Tech Corp",
        "kh": "តិច ខូប"
    },
    "company_logo": "logos/tech.png",
    "location": {
        "en": "Phnom Penh",
        "kh": "ភ្នំពេញ"
    },
    "description": {
        "en": "Developed web applications using Laravel",
        "kh": "បង្កើតកម្មវិធីបណ្ដាញដោយប្រើ Laravel"
    },
    "start_date": "2024-01-01",
    "end_date": null,
    "is_current": true
}
```

---

## Education

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/education` | List all education |
| GET | `/education/{education}` | Get education by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/education` | Create education |
| PUT/PATCH | `/education/{education}` | Update education |
| DELETE | `/education/{education}` | Delete education |

---

### GET /education

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "degree": "Bachelor of Computer Science",
            "institution": "Royal University of Phnom Penh",
            "school_logo": "logos/rupp.png",
            "field_of_study": "Computer Science",
            "description": "Graduated with honors",
            "start_date": "2020-10-01",
            "end_date": "2024-06-30",
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ]
}
```

### POST /education (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "degree": {
        "en": "Bachelor of Computer Science",
        "kh": "បរិញ្ញាប័ត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ"
    },
    "institution": {
        "en": "Royal University of Phnom Penh",
        "kh": "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ"
    },
    "school_logo": "logos/rupp.png",
    "field_of_study": {
        "en": "Computer Science",
        "kh": "វិទ្យាសាស្ត្រកុំព្យូទ័រ"
    },
    "description": {
        "en": "Graduated with honors",
        "kh": "បញ្ចប់ការសិក្សាដោយពិន្ទុល្អ"
    },
    "start_date": "2020-10-01",
    "end_date": "2024-06-30"
}
```

---

## Skills

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills` | List all skills |
| GET | `/skills/{skill}` | Get skill by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/skills` | Create skill |
| PUT/PATCH | `/skills/{skill}` | Update skill |
| DELETE | `/skills/{skill}` | Delete skill |

---

### GET /skills

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "name": "Laravel",
            "icon": "icons/laravel.svg",
            "proficiency": 90,
            "category": "backend",
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ]
}
```

### POST /skills (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "name": {
        "en": "Laravel",
        "kh": "ឡារ៉ាវែល"
    },
    "icon": "icons/laravel.svg",
    "proficiency": 90,
    "category": "backend"
}
```

**Category options:** `frontend`, `backend`, `database`

---

## Partners

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/partners` | List all partners |
| GET | `/partners/visible` | List visible partners (ordered) |
| GET | `/partners/{partner}` | Get partner by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/partners` | Create partner |
| PUT/PATCH | `/partners/{partner}` | Update partner |
| DELETE | `/partners/{partner}` | Delete partner |

---

### GET /partners

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "name": "Tech Corp",
            "logo": "logos/tech.png",
            "website_url": "https://techcorp.com",
            "description": "A technology company",
            "is_visible": true,
            "order": 1,
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ]
}
```

### POST /partners (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "name": {
        "en": "Tech Corp",
        "kh": "តិច ខូប"
    },
    "logo": "logos/tech.png",
    "website_url": "https://techcorp.com",
    "description": {
        "en": "A technology company",
        "kh": "ក្រុមហ៊ុនបច្ចេកវិទ្យា"
    },
    "is_visible": true,
    "order": 1
}
```

---

## Software Applications

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/software-applications` | List all software applications |
| GET | `/software-applications/{softwareApplication}` | Get app by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/software-applications` | Create app |
| PUT/PATCH | `/software-applications/{softwareApplication}` | Update app |
| DELETE | `/software-applications/{softwareApplication}` | Delete app |

---

### GET /software-applications

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "name": "VS Code",
            "icon": "icons/vscode.svg",
            "type": "editor",
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ]
}
```

### POST /software-applications (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "name": {
        "en": "VS Code",
        "kh": "វីអេស កូដ"
    },
    "icon": "icons/vscode.svg",
    "type": "editor"
}
```

---

## Messages

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/messages` | Send a message |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages` | List all messages |
| GET | `/messages/{message}` | Get message by ID |
| PATCH | `/messages/{message}/read` | Mark message as read |
| DELETE | `/messages/{message}` | Delete message |

---

### POST /messages

**Request Body:**
```json
{
    "sender_name": "Jane Doe",
    "sender_email": "jane@example.com",
    "subject": "Hello",
    "message": "I'd like to discuss a project."
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Message sent successfully",
    "data": {
        "id": 1,
        "sender_name": "Jane Doe",
        "sender_email": "jane@example.com",
        "subject": "Hello",
        "message": "I'd like to discuss a project.",
        "is_read": false,
        "created_at": "2026-07-26T12:00:00.000000Z",
        "updated_at": "2026-07-26T12:00:00.000000Z"
    }
}
```

---

## Socials

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/socials` | List all social links |
| GET | `/socials/visible` | List visible social links (ordered) |
| GET | `/socials/{social}` | Get social link by ID |

### Protected Routes (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/socials` | Create social link |
| PUT/PATCH | `/socials/{social}` | Update social link |
| DELETE | `/socials/{social}` | Delete social link |

---

### GET /socials

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "platform_name": "GitHub",
            "url": "https://github.com/user",
            "icon": "icons/github.svg",
            "is_visible": true,
            "order": 1,
            "created_at": "2026-07-26T12:00:00.000000Z",
            "updated_at": "2026-07-26T12:00:00.000000Z"
        }
    ]
}
```

### POST /socials (Admin)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
    "platform_name": "GitHub",
    "url": "https://github.com/user",
    "icon": "icons/github.svg",
    "is_visible": true,
    "order": 1
}
```

---

## Project Downloads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/projects/{project}/downloads` | Public | Record a project download |
| GET | `/downloads` | Admin | List all downloads |
| GET | `/downloads/{projectDownload}` | Admin | Get download by ID |
| DELETE | `/downloads/{projectDownload}` | Admin | Delete download record |

---

### POST /projects/{project}/downloads

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Download recorded successfully",
    "data": {
        "id": 1,
        "project_id": 1,
        "email": "user@example.com",
        "downloaded_at": "2026-07-26T12:00:00.000000Z"
    }
}
```

---

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "title.en": ["The title.en field is required."],
        "title.kh": ["The title.kh field is required."]
    }
}
```

### Unauthorized (401)
```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

### Forbidden (403)
```json
{
    "success": false,
    "message": "Forbidden"
}
```

### Not Found (404)
```json
{
    "success": false,
    "message": "Resource not found"
}
```

---

## Summary of All Endpoints

### Public Endpoints (No Auth Required)
| Method | Endpoint |
|--------|----------|
| POST | `/auth/login` |
| POST | `/auth/register` |
| POST | `/forgot-password` |
| POST | `/reset-password` |
| GET | `/projects` |
| GET | `/projects/featured` |
| GET | `/projects/slug/{slug}` |
| GET | `/projects/{project}` |
| POST | `/projects/{project}/downloads` |
| GET | `/experiences` |
| GET | `/experiences/{experience}` |
| GET | `/education` |
| GET | `/education/{education}` |
| GET | `/partners` |
| GET | `/partners/visible` |
| GET | `/partners/{partner}` |
| GET | `/skills` |
| GET | `/skills/{skill}` |
| GET | `/software-applications` |
| GET | `/software-applications/{softwareApplication}` |
| POST | `/messages` |
| GET | `/socials` |
| GET | `/socials/visible` |
| GET | `/socials/{social}` |

### Protected Endpoints (auth:sanctum)
| Method | Endpoint |
|--------|----------|
| POST | `/auth/logout` |
| GET | `/auth/user` |

### Admin Endpoints (auth:sanctum + admin)
| Method | Endpoint |
|--------|----------|
| POST/PUT/DELETE | `/projects` and `/projects/{project}` |
| POST/PUT/DELETE | `/experiences` and `/experiences/{experience}` |
| POST/PUT/DELETE | `/education` and `/education/{education}` |
| POST/PUT/DELETE | `/skills` and `/skills/{skill}` |
| POST/PUT/DELETE | `/partners` and `/partners/{partner}` |
| POST/PUT/DELETE | `/software-applications` and `/software-applications/{softwareApplication}` |
| POST/PUT/DELETE | `/socials` and `/socials/{social}` |
| GET/PATCH/DELETE | `/messages`, `/messages/{message}`, `/messages/{message}/read` |
| GET/DELETE | `/downloads` and `/downloads/{projectDownload}` |

---

## Testing Guide (Using cURL)

Below are cURL commands to test all Authentication & 2FA flows end-to-end.

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Note:** Copy the `access_token` and `refresh_token` (from `Set-Cookie`) for next requests.

---

### 2. Login (Without 2FA)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:** Returns `access_token` + sets `refresh_token` cookie.

---

### 3. Get Authenticated User

```bash
# Replace YOUR_ACCESS_TOKEN with the token from login
curl -X GET http://localhost:8000/api/v1/auth/user \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Refresh Access Token

```bash
# Requires the refresh_token HttpOnly cookie from the previous response
# When testing in browser, the cookie is sent automatically.
# With cURL, you need to capture and send the cookie:

# Step A: Login and save cookies
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -c cookies.txt \
  -d '{"email": "test@example.com", "password": "password123"}'

# Step B: Use the saved cookie to refresh
curl -X POST http://localhost:8000/api/v1/auth/refresh-token \
  -H "Accept: application/json" \
  -b cookies.txt \
  -c cookies.txt
```

**Expected Response:** Returns new `access_token` and updates the `refresh_token` cookie.

---

### 5. Generate 2FA Secret

```bash
curl -X POST http://localhost:8000/api/v1/2fa/generate \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
    "message": "2FA secret generated. Scan the QR code with your authenticator app.",
    "secret": "JBSWY3DPEHPK3PXP",
    "qr_code_url": "otpauth://totp/Laravel:test@example.com?..."
}
```

**Note:** Scan the QR code with Google Authenticator (or use the `secret` to manually add the account).

---

### 6. Enable 2FA

```bash
# Replace 123456 with the actual 6-digit OTP from your authenticator app
curl -X POST http://localhost:8000/api/v1/2fa/enable \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"otp": "123456"}'
```

**Expected Response (Success):**
```json
{
    "message": "2FA has been enabled successfully.",
    "recovery_codes": ["abc-def", "ghi-jkl", "..."]
}
```

**Save the recovery codes** — they are shown only once.

---

### 7. Login (With 2FA — Step 1)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:** No tokens issued. Instead:
```json
{
    "message": "2FA verification is required to complete login.",
    "two_factor_required": true,
    "user_email": "test@example.com"
}
```

---

### 8. Verify 2FA (Step 2 Login — OTP)

```bash
# Replace 654321 with the current OTP from your authenticator app
curl -X POST http://localhost:8000/api/v1/2fa/verify \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \  
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "otp": "654321"
  }'
```

**Expected Response:** Returns `access_token` + sets `refresh_token` cookie.

---

### 9. Verify 2FA (Step 2 Login — Recovery Code)

```bash
curl -X POST http://localhost:8000/api/v1/2fa/verify \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "recovery_code": "abc-def-ghi-jkl"
  }'
```

---

### 10. Logout

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt
```

**Expected Response:** Revokes token + clears `refresh_token` cookie.

---

### 11. Direct API Access Without Token (401 Test)

```bash
curl -X GET http://localhost:8000/api/v1/auth/user \
  -H "Accept: application/json"
```

**Expected Response (401):**
```json
{
    "message": "Unauthenticated"
}
```

---

### 12. Access Admin Route Without Token

```bash
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title": {"en": "Test"}, "slug": "test"}'
```

**Expected Response (401):**
```json
{
    "message": "Unauthenticated"
}
```

---

### Complete End-to-End Automation Script (Bash)

```bash
#!/bin/bash

API_URL="http://localhost:8000/api/v1"
COOKIE_FILE="/tmp/api_cookies.txt"

echo "=== 1. Register ==="
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

echo -e "\n\n=== 2. Login ==="
LOGIN_RESP=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -c "$COOKIE_FILE" \
  -d '{"email":"test@example.com","password":"password123"}')
echo "$LOGIN_RESP"

# Extract access_token from response
ACCESS_TOKEN=$(echo "$LOGIN_RESP" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

echo -e "\n\n=== 3. Get User ==="
curl -s -X GET "$API_URL/auth/user" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== 4. Refresh Token ==="
curl -s -X POST "$API_URL/auth/refresh-token" \
  -H "Accept: application/json" \
  -b "$COOKIE_FILE" -c "$COOKIE_FILE"

echo -e "\n\n=== 5. Logout ==="
curl -s -X POST "$API_URL/auth/logout" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -b "$COOKIE_FILE"

echo -e "\n\n=== 6. Verify 401 after logout ==="
curl -s -X GET "$API_URL/auth/user" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```
