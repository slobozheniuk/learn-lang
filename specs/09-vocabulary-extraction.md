# Spec 09 — Vocabulary Extraction & Word Progress

## Goal
During content processing, extract individual vocabulary words from the text and track them per user. This creates the foundation for the SRS flashcard system.

## Database Tables

### `vocabulary`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `word` | VARCHAR(100) | NOT NULL |
| `base_form` | VARCHAR(100) | NOT NULL — dictionary/lemma form |
| `language` | VARCHAR(10) | NOT NULL |
| `translation` | VARCHAR(255) | NOT NULL — in user's native language |
| `example_sentence` | TEXT | Context from the source text |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

**Unique constraint**: `(base_form, language)` — deduplicate across content items.

### `word_progress`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id |
| `vocabulary_id` | UUID | FK → vocabulary.id |
| `content_id` | UUID | FK → content_items.id — where first encountered |
| `status` | VARCHAR(20) | DEFAULT 'new', CHECK IN ('new','learning','review','mastered') |
| `ease_factor` | FLOAT | DEFAULT 2.5 — SM-2 parameter |
| `interval_days` | INTEGER | DEFAULT 0 |
| `repetitions` | INTEGER | DEFAULT 0 |
| `next_review_at` | TIMESTAMPTZ | DEFAULT now() |
| `last_reviewed_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() |

**Unique constraint**: `(user_id, vocabulary_id)`.

**Index**: `(user_id, next_review_at)` — fast SRS query.

## Backend Changes

### Vocabulary Extraction (`backend/app/services/vocab_extractor.py`)
- During content processing (after AI adaptation), send a second AI prompt:
  - "Extract vocabulary words from this text. For each word, provide: word as used, base form, translation to {native_language}."
  - Return as JSON array.
- Deduplicate against existing vocabulary records.
- Create `word_progress` entries for new words.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/vocabulary` | ✅ | List user's vocabulary (paginated, filterable by status) |
| GET | `/api/vocabulary/stats` | ✅ | Summary: total, new, learning, mastered counts |
| GET | `/api/content/:id/vocabulary` | ✅ | Words extracted from a specific content item |

### Dashboard Update
- The **SRS Review Counter** widget now shows live data: count of `word_progress` where `next_review_at <= now()`.

## Acceptance Criteria
1. Processing a content item extracts vocabulary and creates records.
2. Duplicate words (same base form + language) are not duplicated.
3. Each user gets their own `word_progress` entries.
4. `GET /api/vocabulary` returns the user's word list with progress data.
5. Dashboard review counter shows accurate count of due reviews.
6. Words include translations and example sentences.
