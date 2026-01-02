# CanonSafe™ Development Journey
## A Complete Chronicle of Building an Evals-as-a-Service Platform with AI-Assisted Development

**Date:** January 1-2, 2026
**Duration:** ~4 hours
**Developer:** Shelly Palmer + Claude (AI Pair Programmer)
**Result:** A fully functional, production-deployed SaaS platform

---

## Table of Contents

1. [The Vision](#the-vision)
2. [Phase 1: Research & Architecture](#phase-1-research--architecture)
3. [Phase 2: Backend Development](#phase-2-backend-development)
4. [Phase 3: Frontend Development](#phase-3-frontend-development)
5. [Phase 4: Integration & Testing](#phase-4-integration--testing)
6. [Phase 5: Cloud Deployment](#phase-5-cloud-deployment)
7. [Lessons Learned](#lessons-learned)
8. [Technical Reference](#technical-reference)

---

## The Vision

### The Problem Statement

IP owners (Disney, Warner Bros, game studios) face a critical challenge: How do you ensure that AI-generated content featuring your characters stays true to canon, maintains the character's voice, respects brand safety guidelines, and complies with legal requirements (including performer consent under SAG-AFTRA guidelines)?

### The Solution: CanonSafe™

An "Evals-as-a-Service" platform that acts as a **Character Trust Layer** between AI systems and IP owners. The platform:

1. **Stores Character Cards** - Structured data containing everything about a character:
   - Canon Pack: Facts, voice profile, relationships
   - Legal Pack: Rights metadata, performer consent
   - Safety Pack: Content rating, prohibited topics, required disclosures

2. **Evaluates AI Outputs** - Uses LLM-as-Judge to score responses across four dimensions:
   - Canon Fidelity (30% weight)
   - Voice Consistency (25% weight)
   - Brand Safety (30% weight)
   - Legal Compliance (15% weight)

3. **Certifies Content** - Responses that pass all thresholds earn "CanonSafe™ Certified" status

### The Challenge

Build this entire platform in a single evening session - from concept to production deployment - using AI-assisted "vibe coding."

---

## Phase 1: Research & Architecture

### Step 1.1: Market Research (Parallel Agent Execution)

We started by launching six research agents simultaneously to gather competitive intelligence:

```
Agent 1: Research evals-as-a-service platforms
Agent 2: Research brand safety and moderation tools
Agent 3: Research C2PA provenance standards
Agent 4: Research character AI competitors
Agent 5: Research platform distribution strategies
Agent 6: Research union and regulatory requirements
```

**Key Insight:** Running agents in parallel dramatically reduced research time from ~30 minutes to ~5 minutes.

### Step 1.2: Architecture Decisions

Based on research, we made these technical decisions:

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backend Framework | FastAPI (Python) | Async support, OpenAPI docs, modern |
| Database | SQLite (dev) / PostgreSQL (prod) | Portable, then scalable |
| ORM | SQLAlchemy 2.0 | Async support, type hints |
| Authentication | JWT with passlib/bcrypt | Industry standard |
| Frontend | React 18 + TailwindCSS | Fast development, modern UI |
| LLM Integration | OpenAI gpt-4o-mini | Cost-effective for evals |
| Cloud | GCP Cloud Run + Cloud SQL | Serverless, auto-scaling |
| Frontend Hosting | Vercel | Best-in-class React deployment |

### Step 1.3: Data Model Design

We designed a multi-tenant data model:

```
Organization (tenant boundary)
    └── Franchise (IP collection, e.g., "Toy Story")
        └── CharacterCard (e.g., "Woody")
            └── CardVersion (immutable snapshots)
                ├── canon_facts (JSON)
                ├── canon_voice (JSON)
                ├── canon_relationships (JSON)
                ├── legal_rights (JSON)
                ├── legal_performer_consent (JSON)
                ├── safety_content_rating (string)
                ├── safety_prohibited_topics (JSON)
                └── safety_required_disclosures (JSON)
```

---

## Phase 2: Backend Development

### Step 2.1: Project Scaffolding

Created the project structure:

```
EaaS/
├── src/
│   ├── api/           # FastAPI route handlers
│   ├── models/        # SQLAlchemy ORM models
│   ├── schemas/       # Pydantic validation schemas
│   ├── services/      # Business logic
│   ├── config.py      # Settings management
│   ├── database.py    # DB connection
│   └── main.py        # Application entry
├── tests/             # Pytest test suite
├── frontend/          # React application
├── scripts/           # Utility scripts
└── docs/              # Documentation
```

### Step 2.2: Overcoming Python 3.14 Compatibility

**Challenge:** The development machine had Python 3.14 (bleeding edge), which broke several dependencies.

**Solution:** Created a virtual environment with Python 3.12:

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 2.3: SQLAlchemy Reserved Word Issue

**Challenge:** SQLAlchemy 2.0 reserves certain column names. Our `Organization` model had a `metadata` column that conflicted.

**Error:**
```
ArgumentError: Column name 'metadata' is reserved by SQLAlchemy
```

**Solution:** Renamed `metadata` → `settings` and updated all references.

### Step 2.4: bcrypt/passlib Compatibility

**Challenge:** In production (Cloud Run), bcrypt 4.1+ broke passlib's version detection.

**Error:**
```
AttributeError: module 'bcrypt' has no attribute '__about__'
```

**Solution:** Pinned bcrypt to version 4.0.1 in requirements.txt:

```
bcrypt==4.0.1  # Pin to version compatible with passlib
```

### Step 2.5: Building the Authentication System

Implemented JWT-based authentication:

```python
# src/services/auth.py
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=1440))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
```

**Key endpoints:**
- `POST /api/v1/auth/register` - Create user + organization
- `POST /api/v1/auth/login` - Get JWT token
- `GET /api/v1/auth/me` - Get current user profile

### Step 2.6: Building the Evaluation Engine

The heart of CanonSafe™ - the LLM-as-Judge evaluation system:

```python
# src/services/evaluation.py
class EvaluationService:
    async def evaluate_single(self, character_card, card_version, prompt, response):
        # Run all four evaluations
        canon_result = await self._evaluate_canon_fidelity(...)
        voice_result = await self._evaluate_voice_consistency(...)
        safety_result = await self._evaluate_brand_safety(...)
        legal_result = await self._evaluate_legal_compliance(...)

        # Calculate weighted score
        total = (canon * 0.30 + voice * 0.25 + safety * 0.30 + legal * 0.15)

        # Determine certification
        canonsafe_certified = passed and total >= 85.0
```

Each evaluator uses a carefully crafted system prompt that instructs the LLM to score 0-100 with explanations:

```
SCORE: [number 0-100]
EXPLANATION: [2-3 sentences explaining your score]
```

---

## Phase 3: Frontend Development

### Step 3.1: React Project Setup

Created a Create React App project with TailwindCSS:

```bash
cd frontend
npm init -y
npm install react react-dom react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Step 3.2: Component Architecture

Built a component hierarchy:

```
App.js (routing)
├── AuthContext.js (state management)
├── Layout.js (navigation shell)
│   ├── Dashboard.js
│   ├── Characters.js (full CRUD)
│   ├── Franchises.js
│   ├── Evaluations.js (the magic happens here)
│   ├── TestSuites.js
│   └── Settings.js
├── Login.js
└── Register.js
```

### Step 3.3: API Client with Interceptors

Built a robust API client with automatic token injection and error handling:

```javascript
// src/api/client.js
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### Step 3.4: The Evaluations Page

The star of the show - real-time AI evaluation with visual score display:

```jsx
// Evaluation form submits to backend
const handleEvaluate = async () => {
    const result = await evaluationsApi.evaluate({
        character_card_id: selectedCharacter,
        prompt: prompt,
        model_response: response
    });
    setEvaluationResult(result);
};

// Scores displayed with color coding
<ScoreBar
    label="Canon Fidelity"
    score={scores.canon_fidelity}
    threshold={80}
/>
```

---

## Phase 4: Integration & Testing

### Step 4.1: Port Conflict Resolution

**Challenge:** Port 3001 was occupied by another project (ACID Dashboard).

**Solution:** Changed frontend to port 3003:

```json
// package.json
"scripts": {
    "start": "PORT=3003 react-scripts start"
}
```

### Step 4.2: API Trailing Slash Issue

**Challenge:** FastAPI's redirect behavior caused 307 redirects.

**Error:** `GET /api/v1/characters` → 307 → `/api/v1/characters/`

**Solution:** Added trailing slashes to all list endpoints in the API client:

```javascript
getAll: async (params = {}) => {
    const response = await apiClient.get('/api/v1/characters/', { params });
    return response.data;
},
```

### Step 4.3: Seed Data Script

Created comprehensive demo data:

```python
# scripts/seed_demo_data.py
# Creates:
# - Palmer Group organization
# - Demo Admin user
# - Toy Story franchise
# - Woody character card with:
#   - 14 canon facts
#   - 10 catchphrases
#   - 16 character relationships
#   - Legal rights metadata
#   - Performer consent (Tom Hanks reference)
#   - 24 prohibited topics
#   - 3 required disclosures
# - 17 test cases across all categories
```

### Step 4.4: End-to-End Testing

Verified the complete flow via curl:

```bash
# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"password123"}' \
    | jq -r '.access_token')

# 2. Get character
curl -s "http://localhost:8000/api/v1/characters/" \
    -H "Authorization: Bearer $TOKEN"

# 3. Evaluate a response
curl -s -X POST "http://localhost:8000/api/v1/evaluations/evaluate" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @eval_test.json
```

**Result:** Working evaluation with real LLM scores!

```json
{
    "scores": {
        "canon_fidelity": 95.0,
        "voice_consistency": 95.0,
        "brand_safety": 90.0,
        "legal_compliance": 90.0,
        "total": 92.75
    },
    "passed": false,
    "failure_reasons": [
        "Brand safety below threshold (90.0 < 95.0)",
        "Legal compliance below threshold (90.0 < 100.0)"
    ],
    "canonsafe_certified": false
}
```

---

## Phase 5: Cloud Deployment

### Step 5.1: Git Repository Setup

```bash
git remote add origin https://github.com/s220284/eaas.git
git branch -M main
git push -u origin main
```

### Step 5.2: GCP Project Creation

```bash
# Create project
gcloud projects create mash-ai-prod --name="MASH AI Production"

# Link billing
gcloud billing projects link mash-ai-prod \
    --billing-account=019C9D-986C76-27A290

# Enable APIs
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    containerregistry.googleapis.com
```

### Step 5.3: Cloud SQL PostgreSQL

```bash
# Create instance (takes 3-5 minutes)
gcloud sql instances create mash-ai-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password="MashAI2026Prod!"

# Create database and user
gcloud sql databases create mash_ai --instance=mash-ai-db
gcloud sql users create mash_user --instance=mash-ai-db \
    --password="MashUser2026!"
```

### Step 5.4: Secret Manager

```bash
# Store secrets securely
echo -n "postgresql://..." | gcloud secrets create database-url --data-file=-
openssl rand -hex 32 | gcloud secrets create jwt-secret --data-file=-
echo -n "sk-proj-..." | gcloud secrets create openai-api-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding database-url \
    --member="serviceAccount:${SA}" \
    --role="roles/secretmanager.secretAccessor"
```

### Step 5.5: Docker Build & Deploy

**Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc libpq-dev
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser
CMD exec gunicorn --bind :$PORT --workers 2 src.main:app -k uvicorn.workers.UvicornWorker
```

**Deploy:**
```bash
# Build
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend

# Deploy to Cloud Run
gcloud run deploy mash-ai-backend \
    --image gcr.io/mash-ai-prod/mash-ai-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances mash-ai-prod:us-central1:mash-ai-db \
    --set-secrets DATABASE_URL=database-url:latest,...
```

### Step 5.6: Vercel Frontend Deployment

1. Connected GitHub repo to Vercel
2. Set root directory to `frontend`
3. Added environment variable: `REACT_APP_API_URL`
4. Deployed automatically

### Step 5.7: CORS Configuration

Updated Cloud Run with frontend URL:

```bash
gcloud run services update mash-ai-backend \
    --set-env-vars FRONTEND_URL=https://eaas-mu.vercel.app
```

---

## Lessons Learned

### 1. Parallel Agent Execution is Powerful

Running 6 research agents simultaneously saved enormous time. The key is identifying independent tasks that can run concurrently.

### 2. SQLite for Dev, PostgreSQL for Prod

Using portable column types (String instead of UUID) made the switch seamless. The database just works.

### 3. Version Pinning is Critical

The bcrypt issue would have been a production blocker. Always pin versions for security libraries.

### 4. CORS is Always a Thing

Frontend-backend communication always needs CORS configuration. Set it up early.

### 5. Trailing Slashes Matter

FastAPI's strict routing caused redirect issues. Be consistent with trailing slashes.

### 6. Secrets Management from Day 1

Using GCP Secret Manager kept API keys out of code and environment variables out of Docker images.

### 7. Test Early, Test Often

Writing tests revealed API behavior differences (401 vs 403) that helped refine the implementation.

---

## Technical Reference

### Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://eaas-mu.vercel.app |
| Backend API | https://mash-ai-backend-611530284830.us-central1.run.app |
| API Documentation | https://mash-ai-backend-611530284830.us-central1.run.app/api/docs |

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TailwindCSS, React Router |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic |
| Database | PostgreSQL 15 (Cloud SQL) |
| Authentication | JWT, passlib, bcrypt |
| LLM Integration | OpenAI gpt-4o-mini |
| Cloud Infrastructure | GCP Cloud Run, Cloud SQL, Secret Manager |
| Frontend Hosting | Vercel |
| Version Control | GitHub |

### Scoring Thresholds

| Dimension | Weight | Threshold |
|-----------|--------|-----------|
| Canon Fidelity | 30% | 80% |
| Voice Consistency | 25% | 70% |
| Brand Safety | 30% | 95% |
| Legal Compliance | 15% | 100% |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Create user + org |
| `/api/v1/auth/login` | POST | Get JWT token |
| `/api/v1/auth/me` | GET | Current user profile |
| `/api/v1/characters/` | GET | List characters |
| `/api/v1/characters` | POST | Create character |
| `/api/v1/characters/{id}` | GET/PUT/DELETE | Character CRUD |
| `/api/v1/characters/franchises/` | GET | List franchises |
| `/api/v1/evaluations/evaluate` | POST | Run quick evaluation |
| `/api/v1/evaluations/test-suites` | GET/POST | Test suite management |

---

## Conclusion

In approximately 4 hours, we went from concept to production deployment of a fully functional SaaS platform. The key enablers were:

1. **AI-assisted development** - Claude handled research, code generation, debugging, and deployment
2. **Modern cloud infrastructure** - GCP Cloud Run + Vercel made deployment trivial
3. **Proven architectural patterns** - JWT auth, REST APIs, React SPA
4. **Parallel execution** - Research agents ran simultaneously
5. **Iterative problem-solving** - Each error was diagnosed and fixed quickly

This is the future of software development: human creativity and AI capability working together to build production systems at unprecedented speed.

---

*Built with Claude Code by Anthropic*
*CanonSafe™ - Trust Your Characters*
