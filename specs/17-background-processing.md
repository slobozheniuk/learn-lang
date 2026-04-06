# Spec 17 — Background Processing & Async Pipeline

## Goal
Move content processing (AI adaptation, vocabulary extraction, grammar detection) from synchronous request handling to an async background pipeline. This prevents long request timeouts and improves UX.

## Architecture

```
User submits content
        │
        ▼
  POST /api/content  (returns immediately with status='pending')
        │
        ▼
  Background Worker  (picks up pending items)
        │
        ├─► AI Adaptation → adapted_segments
        ├─► Vocabulary Extraction → vocabulary + word_progress
        └─► Grammar Detection → user_grammar_progress
        │
        ▼
  Update content_items.status = 'ready'
```

## Backend Changes

### Task Queue
- Use **Python `asyncio` background tasks** (via FastAPI's `BackgroundTasks`) for simplicity.
- If scaling is needed later, migrate to Celery + Redis.

### Processing Flow (`backend/app/services/content_processor.py`)
- Refactor to be called as a background task.
- Add step-level status tracking:

### `processing_steps` table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `content_id` | UUID | FK → content_items.id |
| `step_name` | VARCHAR(50) | e.g., 'adaptation', 'vocabulary', 'grammar' |
| `status` | VARCHAR(20) | 'pending', 'running', 'completed', 'failed' |
| `error_message` | TEXT | |
| `started_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |

### SSE / Polling endpoint
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/content/:id/status` | ✅ | Returns current processing status with step details |

### Retry Logic
- On transient AI API failures: retry up to 3 times with exponential backoff.
- On persistent failure: mark step as `failed`, set content status to `error`.

## Frontend Changes

### Processing Status UI
- After submitting content, show a **processing status card** in the dashboard:
  - Step indicators: ○ Adaptation → ○ Vocabulary → ○ Grammar
  - Each step: pending (gray) → running (pulsing blue) → done (green ✓) → failed (red ✗).
- Poll `GET /api/content/:id/status` every 3 seconds while processing.
- On completion: status card transitions to a regular content card.

### Real-time Feel
- Animated step transitions.
- "Processing your text…" message with estimated time.

## Acceptance Criteria
1. Content submission returns immediately (< 500ms).
2. Processing happens in the background.
3. Dashboard shows real-time processing progress.
4. Failed steps show error messages.
5. Retry logic handles transient API failures.
6. Multiple content items can be processed concurrently.
