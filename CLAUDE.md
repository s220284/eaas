# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**MASH AI** (also called CanonSafe) — a "Character Trust Layer" platform for IP owners to control how AI models portray licensed characters through LLM-as-Judge evaluation. Scores AI responses across four dimensions: canon fidelity, voice consistency, brand safety, and legal compliance.

- **Backend**: Python/FastAPI with SQLAlchemy ORM → PostgreSQL (prod) / SQLite (dev)
- **Frontend**: React 18 + TailwindCSS (Create React App)
- **Deployment**: Backend on Google Cloud Run, Frontend on Vercel

---

## Build & Run Commands

### Backend

```bash
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
# API docs: http://localhost:8000/api/docs
```

### Frontend

```bash
cd frontend
npm install   # first time only
npm start     # runs on port 3003
```

### Tests

```bash
source venv/bin/activate
pytest -v                                     # all tests
pytest tests/test_auth.py -v                  # single file
pytest tests/test_auth.py::test_user_registration -v  # single test
pytest --cov=src --cov-report=html            # with coverage
```

Tests use an in-memory SQLite database (configured in `tests/conftest.py`). The `client` fixture provides a FastAPI `TestClient` with auth helpers (`registered_user`, `auth_headers`).

### Linting & Formatting

```bash
black src/ tests/
ruff check src/ tests/
```

### Database Migrations

```bash
alembic revision --autogenerate -m "description"  # generate from model changes
alembic upgrade head                               # apply migrations
```

Migrations auto-run on backend startup via the `startup_event` in `src/main.py`.

### Seed Data

```bash
python scripts/seed_demo_data.py       # orgs, users, franchises
python scripts/populate_peppa_demo.py  # 74 Peppa Pig characters
python scripts/init_taxonomy.py        # taxonomy categories & tags
```

---

## Architecture

### Backend Layers

```
src/
├── main.py          # FastAPI app, CORS, router registration, auto-migration on startup
├── config.py        # Pydantic Settings from env vars (eval thresholds, weights, LLM config)
├── database.py      # SQLAlchemy engine, session factory, get_db dependency
├── api/             # Route handlers (FastAPI routers)
├── models/          # SQLAlchemy ORM models
├── schemas/         # Pydantic request/response validation
├── services/        # Business logic (auth JWT, evaluation LLM-as-Judge)
└── data/            # Demo data fixtures
```

**API prefix**: All routes are under `/api/v1/`. Routers are registered in `main.py`:
- `auth` → `/api/v1/auth` — JWT login/register
- `organizations` → `/api/v1/organizations`
- `characters` → `/api/v1/characters` — character card CRUD
- `test_suites` → `/api/v1/test-suites`
- `evaluations` → `/api/v1/evaluations` — core evaluation engine
- `evaluation_versions` → `/api/v1/evaluation-versions`
- `taxonomy` → `/api/v1/taxonomy` — tag/category management
- `data_quality` → `/api/v1/data-quality`

### Evaluation Engine (`src/services/evaluation.py`)

The core business logic. `EvaluationService.evaluate_single()` takes a character card + prompt + model response and:
1. Builds evaluation context from the card version
2. Sends G-Eval style prompts to OpenAI (`gpt-4o-mini`, temperature 0.0)
3. Scores on 4 dimensions (0-100): canon fidelity (30%), voice consistency (25%), brand safety (30%), legal compliance (15%)
4. Computes weighted aggregate score; pass threshold is 80.0
5. Stores results in `eval_runs` / `eval_results` tables

### Data Model Key Relationships

- Organization → Franchises → CharacterCards → CardVersions
- TestSuites → TestCases
- EvalRuns → EvalResults (one per dimension)
- TaxonomyCategories → TaxonomyTags

### Frontend Structure

```
frontend/src/
├── App.js              # Router + AuthProvider
├── pages/              # Route-level components (Dashboard, Characters, Evaluations, etc.)
├── components/         # Reusable (Layout, CharacterCard, EvaluationPanel, ScoreDisplay, etc.)
├── api/                # Axios API client
├── contexts/           # React Context (auth state)
└── hooks/              # Custom React hooks
```

React Router v6 with `ProtectedRoute` wrapper. State management via React Context (auth) and component-level hooks.

---

## Deployment

### Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://eaas-mu.vercel.app |
| Backend | https://mash-ai-backend-611530284830.us-central1.run.app |
| GCP Project | `mash-ai-prod` (us-central1) |

### Backend Deploy (Cloud Run)

```bash
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend --project mash-ai-prod
gcloud run deploy mash-ai-backend --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1 --project mash-ai-prod --allow-unauthenticated
```

Or via `cloudbuild.yaml` (auto-triggered on push).

### Frontend Deploy

Automatic via Vercel on `git push` to main. Config in `frontend/vercel.json`.

---

## Session Continuity

Read these files at session start (in order):

1. `PROJECT_STATE.md` — current system status, what's working
2. `SESSION_LOG.md` — recent work history, decisions, next steps
3. `CONTINUATION_GUIDE.md` — quick-start commands for resuming

Update `SESSION_LOG.md` at end of each session with work completed and next steps.

---

## Shell Script Line Endings

The Write tool outputs CRLF line endings which break `.sh` files on macOS/Linux. After writing any shell script:

```bash
sed -i '' 's/\r$//' script.sh && chmod +x script.sh
```

---

## Code Conventions

- Files: `snake_case.py` / Classes: `PascalCase` / Functions: `snake_case`
- Type hints on all function signatures
- `pathlib` for file operations
- Parameterized SQL queries (never f-strings)
- Secrets via environment variables only
- Conventional commits format (`feat:`, `fix:`, `docs:`, etc.)
