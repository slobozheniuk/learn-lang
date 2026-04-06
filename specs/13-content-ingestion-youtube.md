# Spec 13 — Content Ingestion: YouTube Transcript

## Goal
Add YouTube video as a content source. Users paste a YouTube URL, the backend extracts the transcript, and it enters the processing pipeline.

## Backend Changes

### YouTube Processing (`backend/app/services/youtube_extractor.py`)
- Use `youtube-transcript-api` to fetch video transcripts.
- Validation:
  - Must be a valid YouTube URL.
  - Video duration ≤ 20 minutes.
  - Transcript must be available (reject if no captions).
- Prefer manual captions in the target language; fall back to auto-generated.
- Strip timestamp info, join into continuous text.

### Video Metadata
- Fetch video title and thumbnail URL via `yt-dlp --dump-json` or YouTube oEmbed API.
- Store thumbnail URL in a new `content_items.metadata` JSONB column.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/content/youtube` | ✅ | Submit a YouTube URL |

### POST body
```json
{
  "url": "https://www.youtube.com/watch?v=xxx",
  "title": "Optional custom title"
}
```

### Dependencies
- Add `youtube-transcript-api` to `requirements.txt`.

### Database Changes
- Add `metadata` JSONB column to `content_items` (nullable):
  ```json
  {
    "youtube_url": "...",
    "thumbnail_url": "...",
    "duration_seconds": 600,
    "channel_name": "..."
  }
  ```

## Frontend Changes

### Ingest Page — YouTube Tab
- **URL input field** with YouTube icon.
- Paste URL → "Load" button → fetch and display preview:
  - Video thumbnail.
  - Title.
  - Duration.
  - Transcript language availability.
- "Add to Stack" button → submit to backend.

### Validation Messages
- "Video is too long (max 20 minutes)"
- "No captions available for this video"
- "Invalid YouTube URL"

## UI Design Notes
- YouTube tab: URL input with red YouTube icon.
- Video preview card: thumbnail + metadata in a clean card layout.
- Loading state while fetching video info.

## Acceptance Criteria
1. User can paste a YouTube URL and import its transcript.
2. Videos over 20 minutes are rejected.
3. Videos without available transcripts are rejected with a message.
4. Video thumbnail is displayed in the Learning Stack.
5. Transcript enters the same AI adaptation + vocab pipeline.
6. YouTube icon (▶️) shown in the Learning Stack.
