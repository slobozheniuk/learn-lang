# Spec 14 — Suggest Translation Mode

## Goal
Build a translation helper where the user types a phrase in their native language and receives 3-5 AI-generated variations ranging from literal to idiomatic in the target language. Users can push selected translations directly to their SRS deck.

## Backend Changes

### AI Translation Service (`backend/app/services/translator.py`)
- Prompt template:
  ```
  Translate the following {native_language} phrase into {target_language}.
  Provide 3-5 variations ordered from most literal to most idiomatic/natural.
  
  For each variation provide:
  - The translation
  - A style label (e.g., "Literal", "Standard", "Colloquial", "Idiomatic")
  - A brief note explaining when to use it
  
  Return JSON: [{ "translation": "...", "style": "...", "note": "..." }, ...]
  ```

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/translate` | ✅ | Get translation variations |
| POST | `/api/translate/save` | ✅ | Save a translation to SRS deck |

### POST `/api/translate` body
```json
{
  "phrase": "I'm looking forward to it",
  "context": "casual email"  // optional
}
```

### POST `/api/translate/save` body
```json
{
  "native_phrase": "I'm looking forward to it",
  "translation": "Ik kijk ernaar uit",
  "style": "Idiomatic"
}
```
- Creates a `vocabulary` entry (base_form = target phrase) and `word_progress` entry.

### Translation History
- Store translations in a new `translation_history` table for the history tab.

### `translation_history`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id |
| `native_phrase` | TEXT | NOT NULL |
| `translations` | JSONB | NOT NULL — array of variations |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

## Frontend Changes

### Translate Page (`src/app/translate/page.tsx`)
- **Input area**: Text field for native language phrase + optional context field.
- **"Translate" button** → shows loading spinner → displays results.
- **Results**: Card for each variation:
  - Translation text (large).
  - Style badge (color-coded: green = literal, blue = standard, purple = idiomatic).
  - Usage note (smaller text).
  - **"+ Add to SRS"** button per variation.
- **History tab**: List of past translations, clicking one re-displays the variations.

### Animations
- Results appear with staggered fade-in animation.
- "Added to SRS" confirmation (checkmark animation on the button).

## UI Design Notes
- Split layout: input on top, results below (mobile) or side-by-side (desktop).
- Each variation card has a subtle left border color matching its style.
- Skeleton loaders while AI is processing.

## Acceptance Criteria
1. User types a phrase and receives 3-5 translation variations.
2. Variations are ordered from literal to idiomatic with labels.
3. User can add any variation to their SRS deck.
4. Translation history is persisted and browsable.
5. Empty input is rejected.
6. Loading state shown during AI processing.
