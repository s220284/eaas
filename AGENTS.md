# AGENTS.md - AI Assistant Instructions for CanonSafe

This file provides instructions for AI coding assistants working on the CanonSafe codebase.

---

## Project Overview

**CanonSafe™** is an Evaluation-as-a-Service (EaaS) platform that helps IP owners ensure AI-generated character content remains faithful to established canon and brand guidelines.

**Core Functionality:**
- Character Cards define canon facts, voice, relationships, and safety rules
- LLM-as-Judge evaluation scores AI responses against character cards
- Multi-tenant organization support with JWT authentication
- Test suites for automated quality assurance

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python 3.11) |
| Database | PostgreSQL (Cloud SQL) / SQLite (dev) |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT with python-jose, passlib, bcrypt |
| Frontend | React 18, TailwindCSS, React Router |
| Deployment | GCP Cloud Run (backend), Vercel (frontend) |
| LLM | OpenAI GPT-4 for evaluations |

---

## Project Structure

```
EaaS/
├── src/                    # Backend source code
│   ├── main.py            # FastAPI app entry point
│   ├── config.py          # Settings and environment config
│   ├── database.py        # SQLAlchemy engine and session
│   ├── models/            # SQLAlchemy ORM models
│   │   ├── user.py        # User, Organization models
│   │   ├── character.py   # Franchise, CharacterCard models
│   │   └── evaluation.py  # TestSuite, EvalRun models
│   ├── routers/           # FastAPI route handlers
│   │   ├── auth.py        # /api/v1/auth/*
│   │   ├── characters.py  # /api/v1/characters/*
│   │   └── evaluations.py # /api/v1/evaluations/*
│   ├── services/          # Business logic
│   │   └── evaluation.py  # LLM-as-Judge scoring engine
│   ├── schemas/           # Pydantic request/response models
│   └── data/              # Demo data and seeds
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.js         # Routes and auth provider
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (AuthContext)
│   │   └── api/           # API client (axios)
│   └── public/
│
├── tests/                 # Pytest test suite
│   ├── conftest.py        # Fixtures and test database
│   ├── test_auth.py       # Authentication tests
│   ├── test_characters.py # Character/Franchise tests
│   └── test_evaluations.py# Evaluation tests
│
├── docs/                  # Documentation
│   ├── JOURNEY_CHRONICLE.md  # Development story
│   ├── PRD.md             # Product requirements
│   └── research/          # Competitive research
│
├── alembic/               # Database migrations
├── Dockerfile             # Cloud Run container
├── requirements.txt       # Python dependencies
└── *.md                   # Project documentation
```

---

## Code Conventions

### Python (Backend)

```python
# File naming: snake_case.py
# Classes: PascalCase
# Functions/variables: snake_case
# Constants: UPPER_SNAKE_CASE

# Always use type hints
def evaluate_response(
    character_card: CharacterCard,
    prompt: str,
    response: str
) -> EvaluationResult:
    ...

# Use Pydantic for request/response validation
class CharacterCreate(BaseModel):
    name: str
    slug: str
    canon_facts: dict[str, CanonFact]

# SQLAlchemy models inherit from Base
class CharacterCard(Base):
    __tablename__ = "character_cards"
    id: Mapped[UUID] = mapped_column(primary_key=True)
```

### JavaScript (Frontend)

```javascript
// File naming: PascalCase.js for components
// Components: PascalCase
// Functions/variables: camelCase

// Use functional components with hooks
const CharacterCard = ({ character }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="...">
      {/* TailwindCSS for styling */}
    </div>
  );
};

export default CharacterCard;
```

### CSS (TailwindCSS)

- Use Tailwind utility classes, not custom CSS
- Custom colors defined in `tailwind.config.js` (mash-* palette)
- Responsive: mobile-first with `md:`, `lg:` breakpoints

---

## API Patterns

### Authentication
All endpoints except `/auth/register` and `/auth/login` require Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
// Success (single item)
{ "id": "uuid", "name": "...", ... }

// Success (list)
[ { "id": "uuid", ... }, ... ]

// Error
{ "detail": "Error message" }
```

### Status Codes
- `200` - Success
- `400` - Bad request (validation, duplicate)
- `401` - Invalid/expired token
- `403` - No credentials provided
- `404` - Resource not found
- `422` - Validation error (Pydantic)
- `500` - Server error

---

## Database Patterns

### SQLAlchemy Models
```python
# Always use UUID primary keys
id: Mapped[UUID] = mapped_column(
    default=uuid.uuid4,
    primary_key=True
)

# Use relationships with back_populates
characters: Mapped[list["CharacterCard"]] = relationship(
    back_populates="franchise"
)

# JSON columns for flexible data
canon_facts: Mapped[dict] = mapped_column(JSON, default=dict)
```

### Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Add new column"

# Apply migrations
alembic upgrade head
```

---

## Testing Requirements

### Running Tests
```bash
# All tests
pytest -v

# Specific file
pytest tests/test_auth.py -v

# With coverage
pytest --cov=src -v
```

### Test Patterns
```python
# Use fixtures from conftest.py
def test_create_character(client, auth_headers, sample_character_data):
    response = client.post(
        "/api/v1/characters",
        json=sample_character_data,
        headers=auth_headers,
    )
    assert response.status_code == 200

# Accept both 401 and 403 for unauthenticated requests
assert response.status_code in [401, 403]
```

### Test Database
- Tests use in-memory SQLite (not production PostgreSQL)
- Each test gets fresh database via `db_session` fixture
- Some tests skipped with `@pytest.mark.skip(reason="Requires shared session")`

---

## Evaluation System

### LLM-as-Judge Scoring
The evaluation service scores responses on three dimensions:

| Dimension | Score | Description |
|-----------|-------|-------------|
| Canon Accuracy | 0-100 | Factual alignment with character card |
| Voice Consistency | 0-100 | Personality and speech pattern match |
| Safety Compliance | Pass/Fail | Content rating and prohibited topics |

### Character Card Structure
```json
{
  "name": "Woody",
  "slug": "woody",
  "canon_facts": {
    "full_name": {"value": "Sheriff Woody Pride", "source": "Toy Story (1995)"}
  },
  "canon_voice": {
    "personality": "Loyal, brave, natural leader",
    "tone": "Warm, encouraging",
    "speech_style": "Western/cowboy vernacular"
  },
  "safety_content_rating": "G",
  "safety_prohibited_topics": ["violence", "adult_content"]
}
```

---

## Deployment

### Backend (GCP Cloud Run)
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend
gcloud run deploy mash-ai-backend \
  --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1

# Environment variables set via Secret Manager
```

### Frontend (Vercel)
- Auto-deploys on push to `main` branch
- Environment variable: `REACT_APP_API_URL`

---

## Common Pitfalls

### 1. bcrypt Version
**Problem:** `AttributeError: module 'bcrypt' has no attribute '__about__'`
**Solution:** Pin bcrypt to 4.0.1 in requirements.txt
```
bcrypt==4.0.1
```

### 2. CORS Errors
**Problem:** Frontend can't reach backend
**Solution:** Ensure `FRONTEND_URL` is set in Cloud Run and CORS origins are configured in `src/config.py`

### 3. Test Session Issues
**Problem:** `KeyError: 'id'` when accessing created objects
**Cause:** SQLite test DB doesn't share sessions between requests
**Solution:** Skip tests that require shared sessions, or use integration tests

### 4. JWT Token Expiry
**Problem:** 401 errors after working for a while
**Solution:** Tokens expire after 30 minutes; re-login to refresh

---

## Key Files to Understand

| File | Why It Matters |
|------|----------------|
| `src/services/evaluation.py` | Core LLM-as-Judge logic |
| `src/models/character.py` | Character Card data model |
| `src/routers/evaluations.py` | Evaluation API endpoints |
| `src/config.py` | All configuration and env vars |
| `frontend/src/contexts/AuthContext.js` | Auth state management |
| `frontend/src/api/client.js` | API client with interceptors |

---

## Do's and Don'ts

### DO:
- Run `pytest -v` before committing
- Update SESSION_LOG.md when starting work
- Use type hints in Python code
- Follow existing patterns in codebase
- Commit with conventional commit messages (`feat:`, `fix:`, `docs:`)

### DON'T:
- Commit secrets or API keys
- Skip writing tests for new features
- Change database models without migrations
- Use custom CSS instead of Tailwind
- Push directly to production without testing locally

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key |
| `OPENAI_API_KEY` | For LLM evaluations |
| `FRONTEND_URL` | CORS allowed origin |
| `ENVIRONMENT` | `development` or `production` |

### Frontend
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API base URL |

---

## Getting Help

1. **Project State:** Read `PROJECT_STATE.md`
2. **Session History:** Read `SESSION_LOG.md`
3. **Quick Start:** Read `CONTINUATION_GUIDE.md`
4. **Full Story:** Read `docs/JOURNEY_CHRONICLE.md`
5. **User Guide:** See `/user-manual` route in frontend

---

*Last Updated: 2026-01-01*
