# Spec 08 — Reader View

## Goal
Build the reading experience page where users consume adapted content. Display text in the Ilya Frank style: each segment shows the adapted version first, then the clean original underneath.

## Frontend Changes

### Reader Page (`src/app/read/[id]/page.tsx`)
- Fetch segments via `GET /api/content/:id/segments`.
- Display each segment as a card:
  - **Adapted text** (top): Bracketed translations styled distinctly (muted color, slightly smaller font, or lower opacity).
  - **Original text** (bottom): Clean target-language text for fluid re-reading.
  - Visual separator between segments.
- **Progress indicator**: Scrollbar or reading progress bar at the top.
- **Back button** → return to dashboard.

### Typography & Styling
- Serif or readable sans-serif font for body text (e.g., "Literata" or "Source Serif Pro" from Google Fonts).
- Ample line-height (1.8) and paragraph spacing.
- Bracketed translations: `opacity-60`, slightly smaller size, distinguishable color (e.g., muted blue).
- Max content width: 680px, centered.
- Dark mode support with comfortable reading contrast.

### Interactive Elements
- **Click/highlight to pronounce**: Clicking a word triggers Web Speech API TTS.
  - Detect word under cursor.
  - Call `speechSynthesis.speak()` with the target language voice.
  - Brief visual highlight on the spoken word.
- **Toggle mode**: Button to switch between:
  - "Adapted" view (interleaved translations).
  - "Clean" view (original text only — for re-reading).

### Loading & Error States
- Skeleton loader while segments load.
- Friendly error message if content is still processing or failed.
- "Processing…" state with animated spinner for pending items.

## UI Design Notes
- Reading-centric: no sidebar, minimal chrome.
- Floating toolbar at bottom: toggle view, TTS play-all, font size control.
- Smooth scroll between segments.
- Subtle fade-in animation for segments as they enter the viewport.

## Acceptance Criteria
1. Clicking a content item on the dashboard opens the reader view.
2. Adapted text shows bracketed translations with distinct styling.
3. Clicking a word triggers pronunciation via Web Speech API.
4. Toggle between adapted and clean reading modes works.
5. Loading state shown while content is processing.
6. Reader is fully responsive on mobile.
7. Font size can be adjusted.
