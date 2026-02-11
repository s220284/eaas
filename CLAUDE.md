# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**MASH AI** (CanonSafe) — a "Character Trust Layer" platform for IP owners to control how AI models portray licensed characters through LLM-as-Judge evaluation. Scores AI responses across four dimensions: canon fidelity, voice consistency, brand safety, and legal compliance.

- **Backend**: Python/FastAPI + SQLAlchemy ORM → PostgreSQL (prod) / SQLite (dev)
- **Frontend**: React 18 + TailwindCSS (Create React App)
- **Deployment**: Backend on Google Cloud Run, Frontend on Vercel

---

## Build & Run Commands

### Backend

```bash
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
# API docs: http://localhost:8000/api/docs
# ReDoc: http://localhost:8000/api/redoc
```

### Frontend

```bash
cd frontend
npm install   # first time only
npm start     # runs on port 3003
```

The frontend auto-detects the backend URL: uses `http://localhost:8000` on localhost, falls back to production Cloud Run URL otherwise. Override with `REACT_APP_API_URL` env var (build-time only, not runtime).

### Tests

```bash
source venv/bin/activate
pytest -v                                     # all tests
pytest tests/test_auth.py -v                  # single file
pytest tests/test_auth.py::test_user_registration -v  # single test
pytest --cov=src --cov-report=html            # with coverage
```

Tests use in-memory SQLite with `StaticPool` (configured in `tests/conftest.py`). Each test gets a fresh database — tables created before, dropped after.

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

Migrations auto-run on backend startup (`src/main.py` startup event). Alembic reads `DATABASE_URL` from environment (not from `alembic.ini`). New models must be imported in `src/models/__init__.py` for Alembic to detect them.

### Seed Data

```bash
python scripts/seed_demo_data.py       # orgs, users, franchises (Woody)
python scripts/populate_peppa_demo.py  # 74 Peppa Pig characters
python scripts/init_taxonomy.py        # taxonomy categories & tags (idempotent)
python scripts/create_demo_test_suites.py  # test cases for characters
python scripts/run_demo_evaluations.py     # run evals and store results
```

All scripts expect to run from repo root with `venv` activated.

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

All routes under `/api/v1/`. Health check at `/` and `/health`.

### Evaluation Engine (`src/services/evaluation.py`)

The core business logic. `EvaluationService.evaluate_single()` takes a character card + prompt + model response and:

1. Builds evaluation context from the card version
2. Sends G-Eval style prompts to OpenAI (`gpt-4o-mini`, temperature 0.0)
3. Scores 4 dimensions (0-100) with per-dimension pass thresholds:
   - Canon Fidelity (weight 30%, threshold 80)
   - Voice Consistency (weight 25%, threshold **70** — lower than others)
   - Brand Safety (weight 30%, threshold 80)
   - Legal Compliance (weight 15%, threshold 80)
4. Computes weighted aggregate; pass threshold 80.0, CanonSafe certification at 85.0
5. Stores results in `eval_runs` / `eval_results` tables

**Mock mode**: If both `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are missing, evaluations fall back to `_mock_evaluation()` returning random scores (70-95). This allows demo mode without API keys.

**Anthropic fallback**: If OpenAI key is missing but Anthropic key is set, uses `claude-3-haiku-20240307`.

### Data Model Key Relationships

```
Organization (tenant)
  ├── Users (role: admin/member/viewer)
  └── Franchises
       └── CharacterCards (status: draft/pending_approval/approved/archived)
            ├── CardVersions (immutable once created; card.current_version_id → active)
            ├── TestSuites → TestCases
            └── EvalRuns → EvalResults
TaxonomyCategories → TaxonomyTags
```

**Important patterns**:
- All IDs are `String(36)` UUIDs (not native UUID type — for SQLite compatibility)
- `CardVersion` uses `ForeignKey` with `use_alter=True` and `post_update=True` to handle circular FK with `CharacterCard`
- JSON columns (`canon_facts`, `canon_voice`, etc.) — validated in Pydantic, not at DB level
- No soft-delete — `CharacterCard.status` enum used for archival
- Timestamps use `datetime.utcnow` (no timezone awareness)

### Auth System

- JWT with HS256, 24-hour expiry, payload: `{"sub": user_id, "exp": timestamp}`
- Password hashing: bcrypt via passlib
- Registration creates both Organization + User atomically (user gets `admin` role)
- Token validated on every request by querying DB for fresh user data (no caching)
- No refresh token mechanism — requires re-login after 24h
- Role checks are manual in route handlers (no decorator pattern)

### Frontend

```
frontend/src/
├── App.js        # Router + AuthProvider
├── pages/        # Route-level components
├── components/   # Reusable UI components
├── api/client.js # Axios client with interceptors
├── contexts/     # AuthContext (React Context)
└── hooks/        # Custom hooks
```

- Auth token stored in `localStorage` keys: `auth_token`, `user`
- Axios interceptor auto-injects Bearer token and handles 401 → redirect to `/login`
- React Router v6 with `ProtectedRoute` wrapper
- No global state library — Context for auth, component state for everything else

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
DATABASE_URL=sqlite:///./mash_demo.db   # SQLite for local dev
SECRET_KEY=<openssl rand -hex 32>       # JWT signing key
OPENAI_API_KEY=sk-...                   # Optional (mock mode without it)
ANTHROPIC_API_KEY=sk-ant-...            # Optional fallback
ENVIRONMENT=development                 # Affects CORS origins
FRONTEND_URL=http://localhost:3001      # Added to CORS allowed origins
```

Settings loaded via Pydantic `BaseSettings` in `src/config.py` with `@lru_cache`.

---

## Deployment

| Service | URL |
|---------|-----|
| Frontend | https://eaas-mu.vercel.app |
| Backend | https://mash-ai-backend-611530284830.us-central1.run.app |
| GCP Project | `mash-ai-prod` (us-central1) |

### Backend (Cloud Run)

```bash
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend --project mash-ai-prod
gcloud run deploy mash-ai-backend --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1 --project mash-ai-prod --allow-unauthenticated
```

Also auto-triggered via `cloudbuild.yaml` on push. Dockerfile uses Python 3.11-slim, gunicorn with UvicornWorker (2 workers, 4 threads), runs as non-root `appuser`, Cloud Run `$PORT` defaults to 8080.

### Frontend (Vercel)

Automatic on `git push` to main. Config in `frontend/vercel.json`.

---

## Test Fixtures (`tests/conftest.py`)

| Fixture | Provides |
|---------|----------|
| `db_session` | Fresh SQLAlchemy session (function-scoped, tables created/dropped per test) |
| `client(db_session)` | FastAPI `TestClient` with DB override |
| `test_user_data` | Registration dict (`test@example.com` / `TestPassword123!`) |
| `registered_user(client)` | Registers user, returns dict with `access_token` |
| `auth_headers(registered_user)` | `{"Authorization": "Bearer <token>"}` |
| `sample_character_data` | Full character card structure for testing |
| `sample_franchise_data` | Franchise creation data |

**Pattern for authenticated tests**:
```python
def test_something(client, auth_headers):
    response = client.post("/api/v1/endpoint", json=data, headers=auth_headers)
```

---

## Session Continuity

Read at session start: `PROJECT_STATE.md` → `SESSION_LOG.md` → `CONTINUATION_GUIDE.md`

Update `SESSION_LOG.md` at end of each session.

Demo credentials: `peppapig@demo.canonsafe.com` / `Peppa`

---

## Code Conventions

- Files: `snake_case.py` / Classes: `PascalCase` / Functions: `snake_case`
- Type hints on all function signatures
- `pathlib` for file operations
- Parameterized SQL queries (never f-strings)
- Secrets via environment variables only
- Conventional commits format (`feat:`, `fix:`, `docs:`, etc.)

## Shell Script Line Endings

The Write tool outputs CRLF line endings which break `.sh` files on macOS/Linux. After writing any shell script:

```bash
sed -i '' 's/\r$//' script.sh && chmod +x script.sh
```
