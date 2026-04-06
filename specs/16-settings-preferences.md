# Spec 16 — Settings & User Preferences

## Goal
Build a settings page where users can update their profile, change languages, manage preferences, and control app behavior.

## Frontend Changes

### Settings Page (`src/app/settings/page.tsx`)
Organized into sections:

#### Profile
- Display name (editable).
- Email (read-only, from Auth0).
- Avatar (from Auth0, non-editable for now).

#### Languages
- Native language selector (dropdown with flags).
- Target language selector (dropdown with flags).
- Warning modal if changing languages: "Changing your target language will affect future content processing. Existing content will not be re-processed."

#### Reading Preferences
- **Font size**: Slider (14px – 24px), persisted.
- **Font family**: Dropdown (Serif / Sans-serif).
- **Theme**: Light / Dark / System toggle.
- **Show pronunciation guides**: Toggle (enables/disables TTS click behavior).

#### SRS Preferences
- **Daily review limit**: Number input (default: 50).
- **New cards per day**: Number input (default: 20).

#### Notifications
- **Browser notifications**: Toggle for SRS review reminders.
- **Review reminder time**: Time picker (default: 09:00).

#### Account
- **Export data**: Download all user data as JSON.
- **Delete account**: Red button, confirmation modal with "type DELETE to confirm".

## Backend Changes

### `user_preferences` table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id, UNIQUE |
| `font_size` | INTEGER | DEFAULT 18 |
| `font_family` | VARCHAR(20) | DEFAULT 'serif' |
| `theme` | VARCHAR(10) | DEFAULT 'dark' |
| `show_pronunciation` | BOOLEAN | DEFAULT true |
| `daily_review_limit` | INTEGER | DEFAULT 50 |
| `new_cards_per_day` | INTEGER | DEFAULT 20 |
| `notification_enabled` | BOOLEAN | DEFAULT false |
| `notification_time` | TIME | DEFAULT '09:00' |

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/settings` | ✅ | Get user preferences |
| PATCH | `/api/settings` | ✅ | Update preferences |
| GET | `/api/settings/export` | ✅ | Export all user data |
| DELETE | `/api/me` | ✅ | Delete account and all data |

## UI Design Notes
- Clean form layout with clear section headers.
- Changes auto-save with debounced PATCH (no explicit "Save" button).
- Visual confirmation: brief green checkmark on saved fields.
- Danger zone (delete account) at the very bottom, visually separated.

## Acceptance Criteria
1. User can update display name and languages.
2. Reading preferences (font, theme) apply immediately in the reader.
3. SRS limits are respected during review sessions.
4. Data export downloads a complete JSON file.
5. Account deletion removes all user data after confirmation.
6. Theme toggle works across the entire app.
