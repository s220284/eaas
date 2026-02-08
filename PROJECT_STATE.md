# CanonSafe - Project State

**Last Updated:** 2026-02-05 03:30 (All Systems Operational - Evaluations, History, Taxonomy Complete)

---

## System Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend API | **✅ DEPLOYED** | Cloud Run revision mash-ai-backend-00029-xh4 |
| Frontend | **✅ DEPLOYED** | Vercel (auto-deploys from main) |
| Database | **✅ DEPLOYED** | GCP Cloud SQL PostgreSQL (production only) |
| Evaluation Engine | **✅ WORKING** | Scores correctly, thresholds at 80.0 |
| Evaluation History | **✅ WORKING** | Stores and retrieves evaluation runs |
| Taxonomy System | **✅ COMPLETE** | 4 categories, 15 tags |
| Auto-Migrations | **✅ ENABLED** | Alembic runs on startup |
| Test Suite | ✅ Complete | Pytest suite passing |
| Documentation | ✅ Complete | PRD, Journey Chronicle, User Manual |

---

## Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://eaas-mu.vercel.app |
| **Backend API** | https://mash-ai-backend-611530284830.us-central1.run.app |
| **API Docs** | https://mash-ai-backend-611530284830.us-central1.run.app/api/docs |
| **GitHub Repo** | https://github.com/s220284/eaas |

---

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | peppapig@demo.canonsafe.com |
| Password | Peppa |
| Organization | Peppa Pig (04f9ca56-1e14-446a-b771-7f8d2453b4f8) |
| Franchise | Peppa Pig (7c6220e5-7cae-466b-9a80-8280c416cd38) |
| Characters | 74 characters loaded |

---

## Critical Configuration

### Evaluation Thresholds (src/config.py)
```python
canon_fidelity_threshold: 80.0
voice_consistency_threshold: 70.0
brand_safety_threshold: 80.0
legal_compliance_threshold: 80.0
total_score_threshold: 80.0
```

### Evaluation Weights
```python
weight_canon_fidelity: 0.30
weight_voice_consistency: 0.25
weight_brand_safety: 0.30
weight_legal_compliance: 0.15
```

### Database Schema (Key Points)
- **test_suite_id**: NULLABLE (for quick evaluations)
- **test_case_id**: NULLABLE (for quick evaluations)
- Auto-migrations run on startup via src/main.py

---

## Taxonomy System

### Categories & Tags (Complete)
1. **🚫 Prohibited Content** (prohibited_content): 5 tags
   - violence [high], adult_themes [high], profanity [medium], hate_speech [high], drugs [high]

2. **👤 Character Traits** (character_traits): 3 tags
   - friendly, loyal, brave

3. **🎬 Content Ratings** (content_rating): 4 tags
   - g, pg, pg13, r

4. **🔗 Relationship Types** (relationship_types): 3 tags
   - family, friend, romantic

### Initialization
- Endpoint: `POST /api/v1/taxonomy/initialize`
- **Idempotent**: Creates missing categories and tags
- Safe to call multiple times
- Already run in production

---

## Recent Fixes (2026-02-05 Session)

### 1. Evaluation Thresholds
**Problem**: Legal compliance at 100.0 (impossible), brand safety at 95.0 (too strict)
**Fix**: Lowered both to 80.0 for consistency
**Commit**: 87acbee, a33fcf0
**Deployed**: Revision 00023-00024

### 2. Evaluation Storage
**Problem**: Quick evaluations not storing (test_suite_id NOT NULL constraint)
**Fix**: Made test_suite_id nullable in model + alembic migration
**Commit**: a33fcf0, 54713f6
**Deployed**: Revision 00024

### 3. History Endpoint Crash
**Problem**: 500 error when listing evaluation runs
**Root Cause 1**: UUID vs String type mismatch in organization_id filter
**Root Cause 2**: test_suite_id not Optional in response schema
**Root Cause 3**: test_case_id not Optional in response schema
**Fix**: Added str() conversions, made fields Optional[UUID]
**Commits**: 52a5b98, 59e1be3, 5ccae1f
**Deployed**: Revision 00025-00027

### 4. Taxonomy Missing Data
**Problem**: Only 1 category with 3 tags (manual creation), missing 3 categories + 2 tags
**Root Cause**: Initialize endpoint exited if ANY category existed
**Fix**: Made endpoint fully idempotent - creates missing categories AND missing tags
**Commits**: 3152a32, d5dec89
**Deployed**: Revision 00028-00029
**Result**: 4 categories, 15 tags complete

---

## Architecture Overview

```
CanonSafe - Character Trust Layer
├── Backend (GCP Cloud Run)
│   ├── FastAPI (Python 3.11)
│   ├── PostgreSQL (Cloud SQL)
│   ├── Alembic (auto-migrations on startup)
│   ├── JWT Authentication
│   └── OpenAI API (LLM-as-Judge)
│
├── Frontend (Vercel)
│   ├── React 18
│   ├── TailwindCSS
│   └── React Router
│
└── Infrastructure
    ├── GCP Secret Manager
    ├── Docker (Cloud Build)
    ├── Auto-deploy: git push → build → Cloud Run
    └── Frontend: git push → Vercel auto-deploy
```

---

## Deployment Workflow (CLOUD ONLY)

**⚠️ CRITICAL: Work ONLY in cloud. No localhost development.**

### Deploy Backend
```bash
cd /Users/shellypalmer/s220284/eaas
git add -A
git commit -m "Description"
git push origin main
gcloud run deploy mash-ai-backend --source . --region us-central1 --allow-unauthenticated --project mash-ai-prod
```

### Frontend Auto-Deploys
Frontend auto-deploys from GitHub main branch to Vercel. No manual steps needed.

### Database Migrations
Migrations run automatically on backend startup via src/main.py.
New migrations: `alembic revision -m "description"` then deploy.

---

## Testing Production

### Quick Evaluation Test
```bash
# 1. Login
curl -X POST "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"peppapig@demo.canonsafe.com","password":"Peppa"}'

# 2. Get character ID
curl "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/characters?franchise_id=7c6220e5-7cae-466b-9a80-8280c416cd38" \
  -H "Authorization: Bearer <TOKEN>"

# 3. Run evaluation
curl -X POST "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/evaluations/evaluate" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"character_card_id":"<CHAR_ID>","prompt":"Test","model_response":"Response"}'

# 4. Check history
curl "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/evaluations/runs" \
  -H "Authorization: Bearer <TOKEN>"
```

### Verify Taxonomy
```bash
curl "https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/taxonomy/categories" \
  -H "Authorization: Bearer <TOKEN>"
# Should return 4 categories with 15 total tags
```

---

## Git History (Recent)

```
d5dec89 fix: Add missing tags to existing taxonomy categories
3152a32 fix: Make taxonomy initialization idempotent
5ccae1f fix: Make test_case_id optional in EvalResultResponse
59e1be3 fix: Make test_suite_id optional in EvalRunResponse schema
52a5b98 fix: Fix evaluation history endpoint crashes
54713f6 feat: Add automatic database migrations on startup
a33fcf0 fix: Make test_suite_id nullable and lower evaluation thresholds
87acbee fix: Lower evaluation thresholds to realistic values
```

---

## Key Files & Functions

| File | Critical Functions |
|------|-------------------|
| `src/config.py` | Evaluation thresholds (lines 56-61) |
| `src/api/evaluations.py` | quick_evaluate (line 390+), list_eval_runs (line 286+) |
| `src/api/taxonomy.py` | initialize_taxonomy (line 351+) |
| `src/services/evaluation.py` | evaluate_single (scoring logic) |
| `src/models/evaluation.py` | EvalRun (line 84+), test_suite_id nullable (line 97) |
| `src/schemas/evaluation.py` | EvalRunResponse (line 121+), Optional fields |
| `src/main.py` | Auto-migration startup event (line 37+) |
| `alembic/versions/e9bbe2a25220_*.py` | Migration: test_suite_id nullable |

---

## Environment Variables (Production)

Stored in GCP Secret Manager:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing key
- `OPENAI_API_KEY` - LLM evaluations
- `FRONTEND_URL` - https://eaas-mu.vercel.app
- `ENVIRONMENT` - production

---

## Known Working State

### Evaluations
- ✅ Run correctly with realistic thresholds
- ✅ Score on 4 dimensions (canon, voice, safety, legal)
- ✅ Pass/fail logic works (scores ≥80.0 pass)
- ✅ Store to database (test_suite_id=NULL for quick evals)
- ✅ Return proper response with scores and explanations

### History
- ✅ List endpoint returns evaluation runs
- ✅ Filters by organization automatically
- ✅ Handles quick evaluations (NULL test_suite_id)
- ✅ Proper serialization with Optional fields

### Taxonomy
- ✅ 4 categories fully populated
- ✅ 15 tags with descriptions and severity
- ✅ Initialize endpoint idempotent
- ✅ Can be called multiple times safely

---

## Session Continuation Commands

```bash
# Check deployment status
gcloud run services describe mash-ai-backend --region us-central1 --project mash-ai-prod

# View logs
gcloud run services logs read mash-ai-backend --region us-central1 --project mash-ai-prod --limit 50

# Test API health
curl https://mash-ai-backend-611530284830.us-central1.run.app/health

# Check frontend
curl https://eaas-mu.vercel.app

# Git status
cd /Users/shellypalmer/s220284/eaas && git status
```

---

## Critical Reminders

1. **CLOUD ONLY**: Never work on localhost. All development in cloud.
2. **Test First**: Run evaluations via API before considering changes.
3. **Commit Often**: Every logical change gets a commit.
4. **Read PRD**: Reference docs/PRD.md for product requirements.
5. **Check State**: Read this file at session start.

---

**Status: ALL SYSTEMS OPERATIONAL - Ready for next feature**
