# Spec 05 — Dashboard Shell & Navigation

## Goal
Build the main application shell — sidebar/navbar, dashboard page with placeholder widgets, and route structure for future pages. This is the "home base" for all logged-in users.

## Frontend Changes

### App Shell (`src/components/AppShell.tsx`)
- **Sidebar** (desktop) / **Bottom nav** (mobile) with navigation links:
  - 📚 Dashboard (`/dashboard`)
  - ✏️ New Content (`/ingest`) — placeholder
  - 🃏 Review (`/review`) — placeholder
  - 📖 Grammar (`/grammar`) — placeholder
  - 💬 Translate (`/translate`) — placeholder
  - ⚙️ Settings (`/settings`) — placeholder
- **Top bar**: App logo, user avatar + dropdown (profile, logout).
- Collapsible sidebar on desktop with smooth animation.

### Dashboard Page (`src/app/dashboard/page.tsx`)
| Widget | Content (placeholder for now) |
|--------|-------------------------------|
| **Learning Stack** | "No content yet — add your first text!" with CTA button |
| **SRS Review Counter** | "0 words to review" badge |
| **Grammar Progress** | Empty progress bar, "No topics tracked" |

### Route Guards
- All `/dashboard/*` routes require authentication.
- Unauthenticated → redirect to `/`.

## UI Design Notes
- Dark mode by default (user can toggle later).
- Sidebar: semi-transparent backdrop blur, subtle border.
- Dashboard cards: glass-morphism style, hover elevation.
- Responsive breakpoints: sidebar collapses to bottom nav at `md` breakpoint.

## Acceptance Criteria
1. Authenticated user sees the dashboard with sidebar navigation.
2. All sidebar links navigate without full page reload.
3. Dashboard displays three placeholder widget cards.
4. Mobile view shows bottom navigation bar.
5. Clicking the user avatar opens a dropdown with "Settings" and "Logout".
6. Unauthenticated visit to `/dashboard` redirects to `/`.
