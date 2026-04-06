# Spec 01 — Project Scaffold

## About the App

**Learn Lang** is a minimalist, AI-driven web application for language learning. It is built around the **Ilya Frank Reading Method** — a technique where target-language text is interleaved with literal translations in brackets, allowing learners to absorb vocabulary and grammar organically through reading rather than rote memorization.

### Key concepts
- **Learning Stack**: A personal feed of user-uploaded content (pasted text, PDFs, images via OCR, YouTube transcripts) that gets AI-adapted into the Frank reading format.
- **SRS Flashcards**: Words discovered during reading are automatically added to a spaced-repetition deck (SM-2 algorithm) for long-term retention.
- **Grammar Roadmap**: The system passively tracks grammar patterns encountered in texts and lets users prove mastery through AI-generated tests.
- **Suggest Translation**: A quick-access tool where users type a native-language phrase and receive multiple target-language variations (literal → idiomatic).

### Supported languages
- **Target (learnable)**: English, Dutch
- **Native (UI / translations)**: English, Dutch, Russian

### Target users
Private beta — invite-only via email allowlist to manage AI API costs. No public sign-up.

## Goal
Set up the mono-repo structure with a runnable Next.js frontend, FastAPI backend, PostgreSQL database, and Docker Compose orchestration. After this spec is complete a developer can run `docker compose up` and see both services healthy.

## Deliverables

### Repository layout
```
learn-lang/
├── frontend/          # Next.js app
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout, global fonts, metadata
│   │   │   ├── page.tsx          # Landing / redirect to dashboard
│   │   │   └── globals.css       # Tailwind directives + design tokens
│   │   ├── components/
│   │   │   └── ui/               # shadcn/ui primitives (Button, Card…)
│   │   └── lib/
│   │       └── api.ts            # Axios/fetch wrapper pointing at backend
│   └── Dockerfile
│
├── backend/           # FastAPI app
│   ├── pyproject.toml (or requirements.txt)
│   ├── app/
│   │   ├── main.py               # FastAPI app factory, CORS, routers
│   │   ├── config.py             # Pydantic Settings (env vars)
│   │   ├── database.py           # SQLAlchemy async engine + session
│   │   └── models/               # Empty — models added in later specs
│   ├── alembic/                  # DB migration scaffold
│   │   └── env.py
│   ├── alembic.ini
│   └── Dockerfile
│
├── docker-compose.yml            # frontend, backend, postgres services
├── .env.example                  # Template for required env vars
├── .gitignore
└── README.md
```

### Frontend (`frontend/`)
| Item | Detail |
|------|--------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS 3 + shadcn/ui |
| TypeScript | Strict mode enabled |
| Dev server | `npm run dev` on port 3000 |
| Landing page | Minimal "Learn Lang" heading + subtitle, confirms app boots |

### Backend (`backend/`)
| Item | Detail |
|------|--------|
| Framework | FastAPI 0.110+ |
| Python | 3.12 |
| DB driver | asyncpg via SQLAlchemy 2 (async) |
| Migrations | Alembic |
| Health endpoint | `GET /api/health` → `{ "status": "ok" }` |
| CORS | Allow `http://localhost:3000` in dev |

### Docker Compose
| Service | Image / Build | Ports |
|---------|---------------|-------|
| `frontend` | `./frontend` | 3000:3000 |
| `backend` | `./backend` | 8000:8000 |
| `db` | `postgres:16-alpine` | 5432:5432 |

### Environment variables (`.env.example`)
```
POSTGRES_USER=learnlang
POSTGRES_PASSWORD=changeme
POSTGRES_DB=learnlang
DATABASE_URL=postgresql+asyncpg://learnlang:changeme@db:5432/learnlang
OPENROUTER_API_KEY=
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

## Acceptance Criteria
1. `docker compose up --build` starts all three services without errors.
2. `curl http://localhost:8000/api/health` returns `200 { "status": "ok" }`.
3. Opening `http://localhost:3000` renders the landing page.
4. Alembic can generate and apply an empty migration.
5. shadcn/ui `Button` component renders on the landing page.
