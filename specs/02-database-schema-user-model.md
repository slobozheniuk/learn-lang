# Spec 02 — Database Schema & User Model

## Goal
Define the core database schema (User, Language preferences) and create the Alembic migration so the tables exist when the backend starts. No authentication yet — that comes in Spec 03.

## Database Tables

### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `display_name` | VARCHAR(100) | |
| `native_language` | VARCHAR(10) | NOT NULL, CHECK IN ('en','nl','ru') |
| `target_language` | VARCHAR(10) | NOT NULL, CHECK IN ('en','nl') |
| `auth0_sub` | VARCHAR(255) | UNIQUE — populated after auth integration |
| `is_active` | BOOLEAN | DEFAULT true |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |
| `updated_at` | TIMESTAMPTZ | DEFAULT now(), auto-update |

### `allowlist`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | SERIAL | PK |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

## Backend Changes

### Models (`backend/app/models/user.py`)
- SQLAlchemy ORM models for `users` and `allowlist`.
- Language enums defined as Python `Enum`.

### Schemas (`backend/app/schemas/user.py`)
- Pydantic schemas: `UserCreate`, `UserRead`, `UserUpdate`.

### Alembic Migration
- Auto-generate migration from models.
- Migration must be idempotent (uses `IF NOT EXISTS` where applicable).

## Acceptance Criteria
1. `alembic upgrade head` creates `users` and `allowlist` tables.
2. `alembic downgrade -1` cleanly drops them.
3. Inserting a user with invalid `native_language` fails the CHECK constraint.
4. A simple Python unit test can create and read a User via SQLAlchemy session.
