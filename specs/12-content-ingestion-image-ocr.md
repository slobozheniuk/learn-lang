# Spec 12 — Content Ingestion: Image (OCR)

## Goal
Add image upload with OCR text extraction. Users upload a photo of text (e.g., a book page, sign, menu), the backend extracts text via EasyOCR, and it enters the processing pipeline.

## Backend Changes

### OCR Processing (`backend/app/services/ocr_extractor.py`)
- Use `EasyOCR` to extract text from images.
- Supported formats: JPEG, PNG, WebP.
- Max file size: 10 MB.
- Language parameter set to user's `target_language` for better OCR accuracy.
- Post-processing: Join OCR text blocks into coherent paragraphs.

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/content/upload/image` | ✅ | Upload an image for OCR |

### Upload endpoint
- Accept `multipart/form-data` with:
  - `file`: The image file.
  - `title` (optional): User-provided title.
- Create `content_items` record with `source_type='image'`.
- Run OCR → store extracted text in `raw_text`.
- Trigger AI adaptation + vocab extraction pipeline.

### Dependencies
- Add `easyocr` to `requirements.txt`.
- Note: EasyOCR downloads language models on first use (~100 MB per language). Pre-download in Dockerfile.

## Frontend Changes

### Ingest Page — Image Tab
- **Drag-and-drop zone** (shared component with PDF tab).
- Accept `.jpg`, `.jpeg`, `.png`, `.webp`.
- Image preview thumbnail after selection.
- "Upload & Extract" button.
- Processing status: "Extracting text…" with spinner.
- On success → show extracted text preview → user can edit before confirming → "Save" button.

### Text Preview/Edit Step
- After OCR, show extracted text in an editable `<textarea>`.
- User can fix OCR errors before the text enters the AI pipeline.
- "Looks good" confirmation button.

## UI Design Notes
- Image preview: max 300px wide, centered, rounded corners.
- Before/after: image on left, extracted text on right (desktop) or stacked (mobile).

## Acceptance Criteria
1. User can upload JPEG/PNG/WebP images.
2. EasyOCR extracts text with reasonable accuracy.
3. User can review and edit extracted text before processing.
4. Edited text is stored and enters the AI pipeline.
5. Image icon (📷) shown in Learning Stack.
6. Large or unsupported files are rejected with clear messages.
