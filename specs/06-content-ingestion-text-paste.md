# Spec 06 — Content Ingestion: Text Paste

## Goal
Implement the first and simplest content ingestion pathway: pasting raw text. The user pastes target-language text, the backend stores it, and it appears in the Learning Stack.

## Database Tables

### `content_items`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id, NOT NULL |
| `source_type` | VARCHAR(20) | NOT NULL, CHECK IN ('text','pdf','image','youtube') |
| `title` | VARCHAR(255) | User-provided or auto-generated |
| `raw_text` | TEXT | NOT NULL |
| `language` | VARCHAR(10) | NOT NULL |
| `status` | VARCHAR(20) | DEFAULT 'pending', CHECK IN ('pending','processing','ready','error') |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() |

## Frontend Changes

### Ingest Page (`src/app/ingest/page.tsx`)
- **Tab bar**: Text | PDF | Image | YouTube (only Text is active in this spec).
- **Text tab**:
  - `<textarea>` with placeholder: "Paste your text here…"
  - Character count indicator.
  - Max 10,000 characters.
  - Optional **Title** input field.
  - **Submit** button → `POST /api/content`.
- On success → toast notification + redirect to `/dashboard`.

### Dashboard Update
- **Learning Stack** widget now queries `GET /api/content` and lists items.
- Each card shows: icon (📝 for text), title, truncated preview, date, status badge.
- Clicking an item navigates to `/read/:id` (placeholder page for now).

## Backend Changes

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/content` | ✅ | Create a content item (text only for now) |
| GET | `/api/content` | ✅ | List user's content items, paginated |
| GET | `/api/content/:id` | ✅ | Get single content item |
| DELETE | `/api/content/:id` | ✅ | Soft delete a content item |

### POST `/api/content` body
```json
{
  "source_type": "text",
  "title": "My First Dutch Text",
  "raw_text": "Dit is een voorbeeld tekst..."
}
```

### Validation
- `raw_text` must be 1–10,000 characters.
- `source_type` must be `text` (other types rejected for now).
- `language` is auto-set to the user's `target_language`.

## Acceptance Criteria
1. User can paste text and submit it.
2. Submitted text appears in the Learning Stack on the dashboard.
3. Empty or oversized text is rejected with a clear error message.
4. Content items are scoped to the authenticated user.
5. Deleting an item removes it from the Learning Stack.
6. Pagination works when user has 10+ content items.
