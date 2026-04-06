# Learn Lang

Minimalist, AI-driven language learning application based on the Ilya Frank Reading Method.

## Project Structure
- `frontend/`: Next.js 14 application.
- `backend/`: FastAPI application.
- `specs/`: Feature specifications and design documents.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Setup
1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Start the services:
   ```bash
   docker compose up --build
   ```

### URLs
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/health`
