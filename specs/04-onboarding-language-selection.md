# Spec 04 — Onboarding & Language Selection

## Goal
After first login, guide the user through a minimal onboarding flow to select their native and target languages. This sets the context for all future AI processing.

## Frontend Changes

### Onboarding Page (`src/app/onboarding/page.tsx`)
- Shown when `User.native_language` or `User.target_language` is unset.
- **Step 1 — Native Language**: Radio group with flags: English 🇬🇧, Dutch 🇳🇱, Russian 🇷🇺.
- **Step 2 — Target Language**: Radio group: English 🇬🇧, Dutch 🇳🇱 (cannot match native).
- **Confirm** button → PATCH `/api/me` with selections → redirect to `/dashboard`.
- Animated step transitions (slide / fade).

### Redirect Logic
- Middleware or layout-level check: if authenticated but languages not set → redirect to `/onboarding`.

## Backend Changes
- The existing `PATCH /api/me` endpoint already supports `native_language` and `target_language`.
- Add validation: `target_language != native_language`.

## UI Design Notes
- Centered card layout, max-width 480px.
- Large, touch-friendly language option cards.
- Progress indicator (Step 1 of 2 / Step 2 of 2).
- Subtle background gradient.

## Acceptance Criteria
1. New user is redirected to `/onboarding` after first login.
2. User cannot select the same language for native and target.
3. After completing onboarding, user is redirected to `/dashboard`.
4. Revisiting `/onboarding` when languages are already set redirects to `/dashboard`.
5. Language selections are persisted to the database.
