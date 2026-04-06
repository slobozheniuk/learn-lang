# Learn Lang — Project Context

## Project Overview
**Learn Lang** is a minimalist, AI-driven language learning platform based on the **Ilya Frank Reading Method**. This method interleaves target-language text with literal translations in brackets, allowing learners to absorb vocabulary and grammar organically.

- **Status**: Specification/Design Phase (Specs 01-18 completed).
- **Core Concept**: Users upload content (text, PDF, images, YouTube) which is then adapted by AI into the "Ilya Frank" format.
- **Key Features**: Learning Stack (AI adaptation), SRS Flashcards (SM-2 algorithm), Grammar Roadmap, and Suggest Translation mode.
- **Target Languages**: English, Dutch (Target); English, Dutch, Russian (Native/UI).

## Directory Overview
The project is currently organized around a series of feature specifications that define the build order.

- `specs/`: Contains 18 markdown files detailing the architecture, database schema, features, and deployment.
- `.gitignore`: Standard git ignore file.
- `.histfile`: Shell history (likely local artifact).

## Key Specifications
| File | Purpose |
|------|---------|
| `specs/README.md` | Master build order and dependency graph. |
| `specs/01-project-scaffold.md` | Technical stack and repository structure. |
| `specs/02-database-schema...` | PostgreSQL schema and Alembic migration setup. |
| `specs/07-ai-text-adaptation.md` | Detailed rules for the Ilya Frank Method and AI prompting. |
| `specs/10-srs-flashcard-review.md` | Logic for spaced-repetition (SM-2). |
| `specs/18-deployment...` | Docker production config and Dokploy integration. |

## Technical Stack (Planned)
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI (Python 3.12), SQLAlchemy 2 (Async), Alembic.
- **Database**: PostgreSQL 16.
- **AI**: OpenRouter (Claude/Llama models).
- **Authentication**: Auth0.
- **Orchestration**: Docker Compose.

## Development Workflow
The project follows a "Foundation -> Core -> Vocabulary -> Ingestion -> Infrastructure" build order. 

### Initial Setup (per Spec 01)
1.  **Scaffold Mono-repo**: Create `frontend/` and `backend/` directories.
2.  **Environment**: Copy `.env.example` to `.env` and fill in API keys.
3.  **Run Services**:
    ```bash
    docker compose up --build
    ```
4.  **Health Check**:
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:8000/api/health`

### Conventions
- **API First**: Backend provides a REST API; Frontend uses a shared `api.ts` wrapper.
- **Migrations**: Always use Alembic for database changes.
- **AI Logic**: Centralized in `backend/app/services/ai_adapter.py`.
- **Styling**: Use shadcn/ui primitives for consistent design tokens.
