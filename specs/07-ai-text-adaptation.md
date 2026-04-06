# Spec 07 — AI Text Adaptation (Ilya Frank Method)

## Goal
When a content item is submitted, process it through an AI model (OpenRouter) to produce the "Ilya Frank" adapted version: chunked target text interleaved with literal translations in brackets. The adaptation must follow the specific rules described by Ilya Frank himself (see reference below).

## Reference
Source: [Text Adaptation Technology — Ilya Frank's Reading Method](http://english.franklang.ru/index.php/text-adaptation-technology)

---

## The Ilya Frank Method — Detailed Rules

The adaptation follows a two-pass reading pattern. Each passage is presented **twice**:
1. **Adapted version** — target text with inline translation prompts in parentheses.
2. **Clean version** — the same passage in pure target language for fluid re-reading.

### Segmentation Rules
- Each adapted excerpt is **1–3 paragraphs** (short paragraphs). Dialogues may include 5–7 short paragraphs.
- If the author's paragraph is large, **break it into two or more** smaller paragraphs (both in the adapted and the clean versions).
- The clean (unadapted) version always follows the adapted version immediately.

### Translation Bracket Rules
The heart of the method is how inline translations are formatted:

| Rule | Description | Example |
|------|-------------|---------|
| **Brackets & case** | Literal translation in parentheses, starting with a lowercase letter within a sentence, placed **before** punctuation marks. | `ik ben in slaap gevallen (I fell asleep)` |
| **Short sentences** | Do not break apart if they closely match the English translation — translate the whole sentence at once. Give the reader a chance to understand it first. | `—Wat (what)?!` |
| **Long sentences** | Break into multiple translated chunks. | `De eerste avond (the first evening) ben ik dus in slaap gevallen (so I fell asleep) op het zand (on the sand)` |
| **Literal + literary** | If the literal translation is extremely unnatural, provide a literary translation first; then the literal translation in quotation marks after a colon. | `bij zonsopgang (at sunrise: «at sun-rising»)` |
| **Literal first, literary after `=`** | When useful, the literal translation comes first and the literary/natural version follows after `=`. | `Het voorstel leek de kleine prins te schokken (the proposal seemed to shock the little prince = the little prince seemed shocked by the proposal)` |
| **Impossible literal** | When literal translation would only confuse, use a literary translation and specify exact word meanings in italics after a semicolon. | `Het is zo dat zijn planeet van herkomst (it is so that his planet of origin; herkomst, de — origin)` |

### Dictionary Form & Word Clarification Rules

| Rule | Description | Example |
|------|-------------|---------|
| **Base/dictionary form** | For inflected words (e.g. irregular past tense), provide the dictionary form in italics after a semicolon. Only the **first 2–3 occurrences**, not throughout the text. | `dat hij lachte (that he laughed; lachen)` |
| **Gender marking** | For Dutch, mark common (de) vs. neuter (het) gender when not obvious from context. Only first 2–3 occurrences. | `schaamte, de` or `zand, het` |
| **Non-primary meaning** | When a word is used in a secondary meaning, specify its main meaning first, then the contextual meaning after a semicolon. | `bol, de — sphere; globe; glass cover` |
| **Same-root illustrations** | Illustrate word meanings with related compounds or derivatives to aid memorization. | `meedogenloos (merciless; meedogen, het — compassion; medelijden, het — pity)` or `straling (radiation; straal, de — ray; stralen — to radiate)` |
| **Different-part-of-speech** | Show a word as a different part of speech when it helps understanding (e.g., verb derived from a noun). | `oud — old` (adjective shown alongside verb `verouderen — to age`) |
| **Synonyms vs. meanings** | Synonyms separated by commas; different meanings separated by semicolons. Do not provide more than two synonyms; only provide meanings relevant to the context. | `wijsheid, de; wijs — wise` |

### What NOT to Translate

| Omit | Reason |
|------|--------|
| Already-translated words | If a word was translated earlier in the same excerpt (same 2–3 paragraphs), skip it. |
| Repeated expressions | Expressions that recur throughout the entire text can be left untranslated after the first few occurrences. |
| Personal names | Usually write in the reader's script; do not translate. |
| Grammatical structures | No grammar explanations — only word/phrase meanings. |
| Preposition mapping | Don't translate prepositions separately if English uses a different one. Dutch `wachten op` = English "wait for" — don't translate `op` as "on". |
| Compound words | Don't break apart words that are actually one semantic unit. Dutch compound nouns like `zonsondergang` should stay together. |
| Forced word order | Don't impose Dutch word order if it only reflects grammar rules (e.g., verb-final in subclauses). Translate in natural English order. |

### Additional Considerations
- **Style matters**: Even though translations are literal, they should feel natural. Have a philological sense — *feel* the words.
- **Use dictionaries constantly**: Don't rely on intuition, even for your native language.
- **Think over the content**: Avoid factual errors in translation.
- **Inserted English words**: When the English translation requires words not in the original, place them in /slashes/: `Ik wist niet goed (I didn't know too /well/) wat ik moest zeggen (what I had to say; moeten — must, to have to)`.
- **Context flow**: If two related words appear adjacent and only one needs translation, translate both so as not to interrupt the flow of speech.

---

## Concrete Example

Target language: **Dutch** → Native language: **English**

**Adapted version:**
> De eerste avond (/on/ the first evening) ben ik dus in slaap gevallen (so I fell asleep; in slaap vallen — to fall asleep) op het zand (on the sand) op duizend mijl afstand (a thousand miles away; mijl, de — mile; afstand, de — distance) van elk bewoond gebied (from any inhabited land; bewonen — to inhabit; gebied, het — area, territory). Ik was veel meer geïsoleerd (I was much more isolated; isoleren — to isolate) dan een schipbreukeling (than a castaway; schipbreuk, de — shipwreck; schip, het — ship; breuk, de — break) op een vlot (on a raft; vlot, het) midden op de oceaan (in the middle of the ocean; oceaan, de).

**Clean version:**
> De eerste avond ben ik dus in slaap gevallen op het zand op duizend mijl afstand van elk bewoond gebied. Ik was veel meer geïsoleerd dan een schipbreukeling op een vlot midden op de oceaan.

---

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
- Call OpenRouter API with a structured prompt (see prompt template below).
  - System prompt encodes the full Ilya Frank rules.
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

### Prompt Template

```
You are a language learning text adapter using the Ilya Frank Reading Method.

Your task: take {target_language} text and produce an adapted version where words and
phrases are followed by inline {native_language} translations in parentheses.

=== FORMATTING RULES ===

STRUCTURE:
- Break text into short excerpts (1-3 paragraphs, or 5-7 for dialogues).
- Each excerpt has TWO parts: the adapted text (with translations), then the clean
  original text (without translations).
- If a paragraph is long, split it into smaller ones in both versions.

TRANSLATION BRACKETS:
- Place translations in parentheses (), lowercase within a sentence, before punctuation.
- For short sentences that closely match {native_language}: translate the whole sentence
  at once. Give the reader a chance to understand first.
- For long sentences: break into multiple translated chunks.

TRANSLATION STYLE (choose as appropriate):
- Literal: word (translation)
- Literal + literary: word (literary translation: «literal translation»)
- Literal first, literary after =: word (literal = more natural phrasing)
- Impossible literal: word (literary translation; word, gender — exact meaning)

WORD CLARIFICATION:
- Show dictionary/base forms for inflected words after a semicolon, in italics.
   Only first 2-3 occurrences per text: dat hij lachte (that he laughed; lachen)
- Mark gender (de/het for Dutch) when not obvious from context. Only first 2-3 times.
- Show related words/roots to aid memorization:
   meedogenloos (merciless; meedogen, het — compassion)
- Separate synonyms with commas, different meanings with semicolons.
  Max 2 synonyms, only context-relevant meanings.

DO NOT TRANSLATE:
- Words already translated in the same excerpt.
- Personal names (transliterate if needed).
- Grammar structures — only word meanings, never grammar explanations.
- Prepositions separately if the {native_language} uses a different one.
- Words that form a single semantic unit — keep them together.

STYLE:
- Translations should feel natural, not mechanical.
- When two adjacent related words appear and only one needs translation,
  translate both so as not to interrupt reading flow.
- If {native_language} requires inserted words not in the original, use /slashes/.

=== OUTPUT FORMAT ===

Return a JSON array. Each element represents one excerpt:
{{
  "original": "Clean target language text without any translations.",
  "adapted": "Target text with (inline translations) as described above."
}}

Multiple excerpts per input text are expected. Keep excerpts to 1-3 paragraphs each.
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
5. Adapted output follows Frank method rules: literal translations, base forms, gender marking, same-root illustrations.
6. Each segment includes both an adapted version and a clean original version.
7. Short sentences are translated as a whole; long sentences are chunked.
8. Words are not re-translated within the same excerpt after first occurrence.
9. Processing errors are handled gracefully (status → `error`, user notified).
10. API key is never exposed to the frontend.
