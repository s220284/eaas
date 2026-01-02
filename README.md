# MASH AI - Character Trust Layer

**Managed Evals-as-a-Service for IP Owners**

MASH AI provides the infrastructure for IP owners (Disney, Warner Bros, NBCUniversal) to control how AI models portray their licensed characters. We are the "Character Trust Layer" - the middleware between AI platforms and character IP.

## Quick Start

### Backend (FastAPI)

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend (uses SQLite by default for demo)
uvicorn src.main:app --reload
```

Backend runs at http://localhost:8000

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm start
```

Frontend runs at http://localhost:3000

## Demo Features

1. **Character Card Display** - View Woody's canonical traits, voice profile, safety rules, and legal requirements

2. **Response Evaluation** - Enter any AI response and get scored across 4 dimensions:
   - **Canon Fidelity** (30%) - Accuracy to character facts
   - **Voice Consistency** (25%) - Personality/tone match
   - **Brand Safety** (30%) - Content appropriateness
   - **Legal Compliance** (15%) - Performer rights

3. **CanonSafe Certification** - Responses that pass all thresholds receive certification

## Project Structure

```
EaaS/
├── src/                      # Backend source code
│   ├── api/                  # FastAPI routes
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   └── data/                 # Demo character data
├── frontend/                 # React frontend
│   └── src/
│       ├── components/       # React components
│       └── App.js            # Main application
├── docs/                     # Documentation
│   ├── PRD.md               # Product Requirements
│   └── research/            # Competitive research
└── scripts/                  # Startup scripts
```

## API Endpoints

### Organizations
- `POST /api/v1/organizations` - Create organization
- `GET /api/v1/organizations` - List organizations

### Characters
- `POST /api/v1/characters` - Create character card
- `GET /api/v1/characters/{id}` - Get character card
- `POST /api/v1/characters/{id}/versions` - Create new version

### Evaluations
- `POST /api/v1/evaluations/evaluate` - Quick evaluation endpoint
- `POST /api/v1/evaluations/runs` - Create evaluation run
- `GET /api/v1/evaluations/runs/{id}` - Get evaluation results

## Configuration

Set environment variables or create `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost/mash_ai
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Competitive Research](docs/research/)

## Technology Stack

- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React, TailwindCSS
- **AI/LLM:** OpenAI, Anthropic (for evaluation)
- **Deployment:** Google Cloud Platform (planned)

---

Built for the Character Trust Layer initiative.
