# Spec 07 — AI Text Adaptation (Ilya Frank Method)

## Goal
When a content item is submitted, process it through an AI model (OpenRouter) to produce the "Ilya Frank" adapted version: chunked target text interleaved with literal translations in brackets.

## Database Changes

### `adapted_segments`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `content_id` | UUID | FK → content_items.id, NOT NULL |
| `position` | INTEGER | NOT NULL — ordering index |
| `original_text` | TEXT | NOT NULL — original target language chunk |
| `adapted_text` | TEXT | NOT NULL — text with bracketed translations |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

## Backend Changes

### AI Service (`backend/app/services/ai_adapter.py`)
- Call OpenRouter API with a structured prompt:
  - System prompt explains the Ilya Frank method, the user's native language, and the target language.
  - User prompt is the raw text from the content item.
  - Response format: JSON array of `{ original, adapted }` segments.
- Model selection: `anthropic/claude-3-haiku` or `meta-llama/llama-3-8b-instruct` (configurable via env var).

### Processing Pipeline (`backend/app/services/content_processor.py`)
- Triggered after `POST /api/content` (synchronous for now; async in a later spec).
- Steps:
  1. Split raw text into paragraphs (~200-400 words each).
  2. Send each paragraph to the AI adapter.
  3. Store returned segments in `adapted_segments`.
  4. Update `content_items.status` → `'ready'`.
- On failure: set status → `'error'`, log the error.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/content/:id/segments` | ✅ | Return adapted segments for a content item |

### Prompt Template (simplified)
```
You are a language learning assistant using the Ilya Frank Reading Method.

Chunk the following {target_language} text into short segments (1-3 sentences).
For each segment, create an adapted version where difficult words and phrases
are followed by a literal {native_language} translation in square brackets [like this].

Include the base/dictionary form of the word in parentheses when relevant.

Rules:
- Keep translations inline, not as footnotes.
- Use square brackets [] for translations.
- Include only literal translations, no grammar explanations.
- Preserve the original text structure.

Return JSON: [{ "original": "...", "adapted": "..." }, ...]
```

## Environment Variables
```
OPENROUTER_API_KEY=sk-or-v1-xxx
AI_MODEL=anthropic/claude-3-haiku-20240307
```

## Acceptance Criteria
1. Submitting text triggers AI processing automatically.
2. `content_items.status` transitions: `pending` → `processing` → `ready`.
3. `GET /api/content/:id/segments` returns ordered adapted segments.
4. Adapted text contains bracketed translations in the user's native language.
5. Processing errors are handled gracefully (status → `error`, user notified).
6. API key is never exposed to the frontend.
