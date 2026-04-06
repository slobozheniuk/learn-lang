# Spec 15 — Grammar Roadmap

## Goal
Implement passive grammar tracking. The system identifies grammar patterns encountered in user-uploaded texts and presents a visual roadmap. Users can trigger AI-generated tests to mark topics as mastered.

## Database Tables

### `grammar_topics`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `language` | VARCHAR(10) | NOT NULL |
| `name` | VARCHAR(100) | NOT NULL — e.g., "Articles", "Past Tense" |
| `description` | TEXT | |
| `category` | VARCHAR(50) | e.g., "Nouns", "Verbs", "Sentence Structure" |
| `difficulty_order` | INTEGER | For display ordering |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

**Seed data**: Pre-populate common grammar topics for English and Dutch.

### `user_grammar_progress`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id |
| `grammar_topic_id` | UUID | FK → grammar_topics.id |
| `times_encountered` | INTEGER | DEFAULT 0 |
| `first_encountered_at` | TIMESTAMPTZ | |
| `last_encountered_at` | TIMESTAMPTZ | |
| `test_score` | FLOAT | NULL until tested (0.0–1.0) |
| `is_mastered` | BOOLEAN | DEFAULT false |
| `mastered_at` | TIMESTAMPTZ | |

**Unique constraint**: `(user_id, grammar_topic_id)`.

## Backend Changes

### Grammar Detection (`backend/app/services/grammar_detector.py`)
- During content processing, send an AI prompt to identify grammar patterns:
  ```
  Identify grammar topics present in this {target_language} text.
  Return a JSON array of topic names from this list: [Articles, Plurals, ...]
  ```
- Update `user_grammar_progress.times_encountered` for each detected topic.

### Grammar Test Generation (`backend/app/services/grammar_test.py`)
- On-demand: user requests a test for a specific grammar topic.
- AI generates 10 multiple-choice or fill-in-the-blank questions.
- Questions are graded, and `test_score` is updated.
- Score ≥ 0.8 → `is_mastered = true`.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/grammar` | ✅ | List all grammar topics with user progress |
| GET | `/api/grammar/:id/test` | ✅ | Generate a test for a topic |
| POST | `/api/grammar/:id/test` | ✅ | Submit test answers and get score |

## Frontend Changes

### Grammar Page (`src/app/grammar/page.tsx`)
- **Roadmap view**: Grid or list of grammar topics, grouped by category.
- Each topic card shows:
  - Topic name.
  - Times encountered badge.
  - Progress state: Not seen (gray) → Encountered (yellow) → Mastered (green ✓).
  - "Take Test" button (enabled when `times_encountered >= 3`).
- **Category sections**: Collapsible accordion by category (Nouns, Verbs, etc.).

### Test Modal/Page (`src/app/grammar/[id]/test/page.tsx`)
- Question display: one at a time.
- Multiple choice: 4 options per question.
- Fill-in-the-blank: text input.
- Progress indicator (Question 3 of 10).
- Results summary at the end: score, pass/fail, "Mastered!" celebration if passed.

### Dashboard Widget Update
- Grammar progress bar shows: `mastered_count / total_topics` for the current topic category.

## UI Design Notes
- Roadmap: visual skill-tree or kanban-like layout.
- Mastered topics: green glow / checkmark overlay.
- Test: clean, focused layout similar to the SRS review page.

## Acceptance Criteria
1. Processing content updates grammar encounter counts.
2. Grammar page lists all topics with their progress states.
3. Users can take a test when a topic has been encountered 3+ times.
4. Test generates 10 relevant questions.
5. Scoring ≥ 80% marks the topic as mastered.
6. Dashboard grammar widget reflects current progress.
