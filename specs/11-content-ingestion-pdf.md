# Spec 11 — Content Ingestion: PDF Upload

## Goal
Add PDF upload as a second content ingestion pathway. Users upload a PDF (max 10 pages), the backend extracts text, and it enters the same processing pipeline as pasted text.

## Backend Changes

### PDF Processing (`backend/app/services/pdf_extractor.py`)
- Use `pdfplumber` to extract text from uploaded PDFs.
- Validation:
  - Max file size: 5 MB.
  - Max pages: 10.
  - Must contain extractable text (not scanned images — that's the Image spec).
- Extract text page-by-page, concatenate with page break markers.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/content/upload/pdf` | ✅ | Upload a PDF file |

### Upload endpoint
- Accept `multipart/form-data` with:
  - `file`: The PDF file.
  - `title` (optional): User-provided title, defaults to filename.
- Create `content_items` record with `source_type='pdf'`.
- Trigger the same processing pipeline (AI adaptation + vocab extraction).

### Dependencies
- Add `pdfplumber` to `requirements.txt`.

## Frontend Changes

### Ingest Page — PDF Tab
- **Drag-and-drop zone** with dashed border and upload icon.
- Click to browse files (accept `.pdf` only).
- File selected → show filename, page count preview, and "Upload" button.
- Upload progress bar.
- On success → toast + redirect to dashboard.

### Validation Messages
- "File too large (max 5 MB)"
- "Too many pages (max 10)"
- "This PDF appears to be a scanned image. Try the Image upload instead."

## UI Design Notes
- Drag-and-drop zone: 200px tall, subtle dashed border, icon animates on hover/drag-over.
- File preview card shows PDF icon + filename + page count.
- Upload progress: thin progress bar inside the card.

## Acceptance Criteria
1. User can drag-and-drop or browse to upload a PDF.
2. PDFs over 5 MB or 10 pages are rejected with clear messages.
3. Extracted text is stored as a content item with `source_type='pdf'`.
4. The content enters the same AI adaptation pipeline as pasted text.
5. PDF icon is shown in the Learning Stack for these items.
6. Upload progress is displayed during file transfer.
