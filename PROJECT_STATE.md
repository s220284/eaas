# CanonSafe - Project State

**Last Updated:** 2026-01-01 (Late Night Session)

---

## System Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend API | **DEPLOYED** | GCP Cloud Run |
| Frontend | **DEPLOYED** | Vercel |
| Database | **DEPLOYED** | GCP Cloud SQL (PostgreSQL) |
| Evaluation Engine | Complete | LLM-as-Judge with OpenAI |
| Test Suite | Complete | 20 tests passing |
| Documentation | Complete | Journey Chronicle + User Manual |

---

## Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://eaas-mu.vercel.app |
| **Backend API** | https://mash-ai-backend-611530284830.us-central1.run.app |
| **GitHub Repo** | https://github.com/s220284/eaas |

---

## Production Credentials

| Service | Account |
|---------|---------|
| App Login | shelly@shellypalmer.com / MashAI2026! |
| GCP Project | mash-ai-prod |
| Vercel | Linked to GitHub repo |

---

## Architecture Overview

```
CanonSafe - Character Trust Layer for IP Owners
├── Backend (GCP Cloud Run)
│   ├── FastAPI (Python 3.11)
│   ├── PostgreSQL (Cloud SQL)
│   ├── JWT Authentication
│   └── OpenAI API (LLM-as-Judge)
│
├── Frontend (Vercel)
│   ├── React 18
│   ├── TailwindCSS
│   └── React Router
│
└── Infrastructure
    ├── GCP Secret Manager (API keys)
    ├── Docker containerization
    └── Auto-deploy on git push
```

---

## Recent Session Accomplishments (2026-01-01)

### Deployment
- Deployed backend to GCP Cloud Run
- Deployed frontend to Vercel
- Set up Cloud SQL PostgreSQL database
- Configured Secret Manager for credentials
- Fixed bcrypt compatibility issue (pinned to 4.0.1)

### Testing
- Created pytest test suite (20 tests passing)
- Tests cover: auth, characters, franchises, evaluations, health checks

### Documentation
- Created `docs/JOURNEY_CHRONICLE.md` - complete dev session documentation
- Created in-app User Manual at `/user-manual`

### Rebranding
- Renamed from "MASH AI" to "CanonSafe™"
- Updated all frontend references with trademark symbol

---

## Git History

```
2129f1d feat: Add comprehensive docs, tests, and rebrand to CanonSafe
d6c60e5 fix: Pin bcrypt version for passlib compatibility
7f1e9ba feat: Complete MASH AI platform with deployment configs
4f6290f chore: Initialize project with Claude Code setup
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/services/evaluation.py` | LLM-as-Judge scoring logic |
| `src/models/character.py` | Character Card schema |
| `frontend/src/pages/UserManual.js` | In-app documentation |
| `docs/JOURNEY_CHRONICLE.md` | Development session chronicle |
| `tests/conftest.py` | Test fixtures |

---

## Environment Variables (Production)

Backend (Cloud Run):
- `DATABASE_URL` - Cloud SQL connection string
- `SECRET_KEY` - JWT signing key
- `OPENAI_API_KEY` - For LLM evaluations
- `FRONTEND_URL` - https://eaas-mu.vercel.app
- `ENVIRONMENT` - production

Frontend (Vercel):
- `REACT_APP_API_URL` - Backend URL

---

## Next Steps (Future Sessions)

1. Add more character cards (Buzz Lightyear, etc.)
2. Implement batch evaluation feature
3. Add evaluation history/analytics dashboard
4. Implement C2PA content credentials
5. Add team/organization management
6. Set up CI/CD pipeline with automated tests

---

## How to Resume Development

```bash
# Navigate to project
cd /Users/shellypalmer/s220284/EaaS

# Activate virtual environment
source venv/bin/activate

# Start backend (local)
uvicorn src.main:app --reload --port 8000

# Start frontend (separate terminal)
cd frontend && npm start

# Run tests
pytest -v
```

---
