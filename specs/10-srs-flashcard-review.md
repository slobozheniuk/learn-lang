# Spec 10 — SRS Flashcard Review

## Goal
Build the spaced repetition review interface. Users review due vocabulary cards, grade their recall, and the SM-2 algorithm updates scheduling parameters.

## Backend Changes

### SM-2 Algorithm (`backend/app/services/srs.py`)
Implement the SM-2 algorithm:
```
Input: quality (0-5 scale, mapped from user grades)
  - Hard → quality = 2
  - Good → quality = 4
  - Easy → quality = 5

If quality >= 3 (correct):
  if repetitions == 0: interval = 1
  elif repetitions == 1: interval = 6
  else: interval = round(interval * ease_factor)
  repetitions += 1
Else (incorrect):
  repetitions = 0
  interval = 1

ease_factor = max(1.3, ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
next_review_at = now + interval days
```

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/review/due` | ✅ | Get next batch of due cards (limit 20) |
| POST | `/api/review/:word_progress_id` | ✅ | Submit a review grade |

### POST `/api/review/:id` body
```json
{
  "grade": "good"  // "hard" | "good" | "easy"
}
```

### Response
```json
{
  "word_progress_id": "...",
  "new_interval_days": 6,
  "next_review_at": "2026-04-12T00:00:00Z",
  "remaining_due": 15
}
```

## Frontend Changes

### Review Page (`src/app/review/page.tsx`)
- **Card front**: Target-language word in large text + example sentence with the word highlighted.
- **Thinking phase**: User mentally recalls the meaning, taps "Show Answer".
- **Card back**: Translation revealed + example sentence with translation.
- **Grade buttons**: Hard (red), Good (blue), Easy (green) — each with the projected next review date.
- **Progress bar**: "5 of 24 reviewed" with animated fill.

### Card Animations
- Flip animation when revealing the answer.
- Slide-out animation when grading (card slides away, next card slides in).
- Celebration animation when all reviews are complete (confetti or checkmark).

### Empty State
- "No reviews due! 🎉" with next review date shown.
- Link back to dashboard.

### Session Summary
After completing all due reviews:
- Cards reviewed count.
- Breakdown: Hard / Good / Easy.
- "Come back tomorrow" message with next review time.

## UI Design Notes
- Full-screen, distraction-free review mode.
- Large, centered card (max-width 500px).
- Touch-friendly grade buttons (min 48px height).
- Keyboard shortcuts: 1 = Hard, 2 = Good, 3 = Easy, Space = Show Answer.

## Acceptance Criteria
1. Due cards are presented one at a time.
2. Grading a card updates `word_progress` with new SM-2 parameters.
3. After grading, the next due card is shown.
4. Completing all reviews shows a summary.
5. No reviews due → empty state with next review date.
6. Keyboard shortcuts work for grading.
7. Card flip and transition animations are smooth.
