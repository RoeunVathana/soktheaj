# CI/CD process

This repository uses GitHub Actions for continuous integration and Railway's
GitHub integration for continuous deployment.

## Pull requests

Every pull request targeting `main` runs:

- Composer manifest validation and Laravel tests in `Backend`.
- A clean `npm ci` install and production Vite build in `Frontend`.

Both jobs must pass before the pull request is merged.

## Production deployments

Pushes to `main` run the same checks. After the checks pass, Railway deploys
the connected services:

- Frontend service root: `/Frontend`
- Backend service root: `/Backend`
- Frontend URL: <https://soktheaj-production.up.railway.app>
- API base URL: <https://backend-production-f646a509.up.railway.app/api/v1>

The Railway backend service uses the Composer deploy script as its pre-deploy
step:

```text
composer run deploy
```

This runs `php artisan migrate --force` and then `php artisan db:seed --force`.
The production seeder only populates an empty database, so later deployments
do not duplicate existing users or portfolio records.

In Railway, enable **Wait for CI** on both the frontend and backend production
services. This makes the native Railway deployment wait for the GitHub Actions
workflow to finish successfully.

The frontend production variable must remain:

```text
VITE_API_URL=https://backend-production-f646a509.up.railway.app/api/v1
```

No Railway tokens or application secrets are stored in the repository.
