# Spec 03 — Authentication (Auth0)

## Goal
Integrate Auth0 for user authentication. After this spec, users can sign up / log in via Auth0 Universal Login, and the backend validates JWTs on protected routes.

## Frontend Changes

### Auth0 Provider (`src/app/providers.tsx`)
- Wrap the app with `Auth0Provider` from `@auth0/nextjs-auth0`.
- Configure `domain`, `clientId`, `audience` from env vars.

### Login / Logout UI
- **Login button** on the landing page (redirects to Auth0).
- **User avatar + dropdown** in the navbar once authenticated (display name, logout).
- Unauthenticated users are redirected to `/` (landing).

### API calls
- Attach `Authorization: Bearer <token>` to all backend requests via the `api.ts` wrapper.

## Backend Changes

### JWT Middleware (`backend/app/auth.py`)
- Validate Auth0 JWTs using `python-jose` / `authlib`.
- Extract `sub` claim and resolve to a `User` record.
- Dependency `get_current_user` for use in route handlers.

### Allowlist Check
- On first login (no matching `auth0_sub`), check `allowlist` table for the user's email.
  - If present → create `User` record, link `auth0_sub`.
  - If absent → return `403 Forbidden`.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/me` | ✅ | Return current user profile |
| PATCH | `/api/me` | ✅ | Update display_name, languages |

## Environment Variables (add to `.env.example`)
```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=xxx
AUTH0_CLIENT_SECRET=xxx
AUTH0_AUDIENCE=https://api.learnlang.local
NEXTAUTH_SECRET=xxx
```

## Acceptance Criteria
1. Clicking "Login" redirects to Auth0 Universal Login.
2. After successful login, user lands on `/dashboard`.
3. `GET /api/me` returns the user profile with a valid token.
4. `GET /api/me` without token returns `401`.
5. A user not on the allowlist receives `403` on first login.
6. Refreshing the page preserves the session.
