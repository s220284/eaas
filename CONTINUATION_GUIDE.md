# CanonSafe - Continuation Guide

Quick reference for resuming work on this project.

---

## Production URLs (LIVE)

| Service | URL |
|---------|-----|
| Frontend | https://eaas-mu.vercel.app |
| Backend API | https://mash-ai-backend-611530284830.us-central1.run.app |
| GitHub | https://github.com/s220284/eaas |

**Login:** Use credentials from password manager

---

## Local Development Startup

```bash
# Navigate to project
cd /Users/shellypalmer/s220284/EaaS

# Check git status
git status
git pull origin main  # Get latest changes

# Activate Python virtual environment
source venv/bin/activate

# Start backend (terminal 1)
uvicorn src.main:app --reload --port 8000

# Start frontend (terminal 2)
cd frontend && npm start

# Run tests
pytest -v
```

---

## State Verification

1. Read `PROJECT_STATE.md` for current status
2. Read `SESSION_LOG.md` for recent work and next steps
3. Check git log: `git log --oneline -5`

---

## Key Workflows

### Adding a New Feature
1. Update SESSION_LOG.md with what you're starting
2. Implement the feature
3. Write tests in `tests/` directory
4. Run tests: `pytest -v`
5. Commit with descriptive message
6. Push to GitHub: `git push origin main`
7. Vercel auto-deploys frontend changes

### Deploying Backend Changes
```bash
# Rebuild and deploy to Cloud Run
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend
gcloud run deploy mash-ai-backend \
  --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1
```

### Running Evaluations
1. Log in at https://eaas-mu.vercel.app
2. Navigate to Characters, select a character
3. Go to Evaluations page
4. Enter prompt and AI response
5. Click Evaluate to run LLM-as-Judge

---

## Important Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Main reference doc (auto-loaded) |
| `PROJECT_STATE.md` | Current system status |
| `SESSION_LOG.md` | Work history and next steps |
| `docs/JOURNEY_CHRONICLE.md` | Complete development story |
| `src/services/evaluation.py` | LLM-as-Judge scoring logic |
| `frontend/src/pages/UserManual.js` | In-app documentation |

---

## GCP Resources

| Resource | Name/ID |
|----------|---------|
| Project | mash-ai-prod |
| Cloud Run | mash-ai-backend |
| Cloud SQL | canonsafe-db (PostgreSQL 15) |
| Region | us-central1 |

---

## Suggested Next Features

1. Add Buzz Lightyear character card
2. Batch evaluation file upload
3. Evaluation history dashboard
4. C2PA content credentials
5. Team/org management

---

*Last Updated: 2026-01-01*
