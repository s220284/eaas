# CLAUDE.md — AI Assistant Continuity Guide

This file helps AI assistants (Claude, etc.) quickly understand and continue work on this repository.

## Repository Identity

- **Name:** EaaS (Evals-as-a-Service) — Patent & V1 Codebase Repository
- **Purpose:** Houses the patent applications for the CanonSafe character IP governance platform, plus the legacy V1 codebase
- **Owner:** s220284@gmail.com
- **GitHub:** https://github.com/s220284/eaas
- **Production App Repo:** https://github.com/s220284/canonsafe-v2 (the active codebase)

## Repository Structure

This repo serves two purposes:

### 1. Patent Applications (actively maintained)

The patent documents in `docs/` describe the complete CanonSafe evaluation-as-a-service system. They are kept in sync with the production codebase in `canonsafe-v2`.

| Document | File | Claims | Figures | Size |
|----------|------|--------|---------|------|
| Method Patent | `docs/PATENT_APPLICATION.md` | 42 (4 independent + 38 dependent) | 20 | ~90KB |
| Provisional Patent | `docs/PROVISIONAL_PATENT_APPLICATION.md` | 50 | 20 | ~150KB |

**Applicant:** Shelly Palmer / The Palmer Group

### 2. V1 Codebase (legacy — superseded by canonsafe-v2)

The Python/FastAPI code in `src/`, `frontend/`, `scripts/`, `tests/` is the original V1 implementation. It has been **fully superseded** by the `canonsafe-v2` repository which has:
- 24 route modules (vs V1's 8)
- 31 SQLAlchemy models (vs V1's ~12)
- 17 service modules (vs V1's 4)
- 24 frontend pages (vs V1's ~10)
- 5-pack Character Cards (vs V1's 3-pack)
- All 16 patent capabilities implemented

**Do not deploy or modify the V1 code.** All active development happens in `canonsafe-v2`.

## Patent Documents — What They Cover

Both patents describe 16 capabilities matching the production `canonsafe-v2` codebase:

1. **5-Pack Character Card** — Canon, Legal, Safety, Visual Identity, Audio Identity packs with immutable versioning
2. **Multi-Modal Evaluation Engine** — Text, image (GPT-4o vision), video, audio evaluation
3. **Configurable Critics Framework** — Pluggable critics with dynamic prompt assembly from Character Card placeholders, per-org/franchise/character weights
4. **Performer Consent Scope Verification** — Temporal, territorial, modality, usage restriction, and strike clause checks as a hard evaluation gate
5. **Agentic Pipeline Middleware (APM)** — SDK, sidecar, webhook, API gateway deployment modes with policy actions (pass/regenerate/quarantine/escalate/block)
6. **Continuous Improvement Flywheel** — Failure pattern detection, rubric refinement suggestions, agent feedback signals, improvement trajectories
7. **Franchise-Level Evaluation** — Cross-character consistency, world-building consistency, franchise health dashboard
8. **Scale Architecture** — Tiered evaluation, statistical sampling, queue-based processing, distributed judge dispatch
9. **Certification & Compliance Reporting** — Two-tier certification (base + CanonSafe Certified), 90-day expiry, CSV/JSON export
10. **Taxonomy-Driven Configuration** — Hierarchical categories and tags with evaluation rules, severity levels, modality filtering
11. **Inter-Critic Agreement & Judge Bias Mitigation** — Multi-provider parallel execution (OpenAI + Anthropic), statistical disagreement detection (σ > 0.3 threshold)
12. **A/B Experimentation Framework** — Controlled experiments with z-test (pass rates) and Welch's t-test (score means), p-value computation via Abramowitz & Stegun CDF
13. **Adversarial Robustness Testing (Red-Teaming)** — 5 attack categories (persona_break, knowledge_probe, safety_bypass, boundary_test, context_manipulation), resilience scoring
14. **CI/CD Pipeline Integration** — GitHub Actions workflows, batch evaluation triggers, reusable workflow templates with configurable thresholds
15. **Evaluation Cost Monitoring** — Per-critic token tracking (prompt_tokens, completion_tokens), per-model pricing, cost analytics by model/critic/character/org
16. **Webhook Event System** — HMAC-SHA256 payload signing, X-Webhook-Signature header, auto-deactivation after 5 consecutive failures

### Method Patent Structure (PATENT_APPLICATION.md)

- **Sections I-V:** Title, Abstract, Field, Background (12 problems + 6 prior art categories), Summary (10 steps)
- **Section VI:** Detailed Description (sections A through BB — system architecture, 5-pack data model, evaluation pipeline, critics framework, APM, improvement flywheel, multi-modal methods, prompt engineering, model agnosticism, scale architecture, versioning, taxonomy, multi-tenancy, consent verification, franchise evaluation, custom judge registry, inter-critic agreement, cost monitoring, A/B experimentation, red-teaming, webhooks, drift detection, CI/CD, review queue, export, pairwise comparison, test data generation)
- **Section VII:** 42 Claims (4 independent: core evaluation method, agent certification, continuous governance, system claim; 38 dependent)
- **Section VIII:** 20 Figure descriptions
- **Section IX:** Prior art search guidance (9 categories, 10 keyword combinations, 9 novelty arguments)
- **Section X:** Recommendations for IP counsel

### Provisional Patent Structure (PROVISIONAL_PATENT_APPLICATION.md)

- **Specification:** Title, cross-references, 18 prior art references (8 patents, 6 academic, 4 standards), field, background, summary with 16 capabilities
- **Detailed Description:** Sections A through CC (same scope as method patent, with more formal patent language and numbered figure references)
- **Claims:** 50 claims (Claims 1-38 original, Claims 39-50 added for new features)
- **Abstract:** Comprehensive single-paragraph summary
- **Drawings:** 20 figure descriptions
- **Filing Instructions:** Step-by-step USPTO filing guide

## Updating the Patents

When new features are added to the `canonsafe-v2` codebase:

1. Add a new capability section in the Summary (both patents)
2. Add a detailed description section (both patents)
3. Add new claims (both patents — method patent uses Claims 5+ as dependent on Claim 1; provisional uses sequential numbering)
4. Add figure descriptions if needed
5. Update the Abstract to mention the new capability
6. Commit and push to this repo

## V1 Codebase Reference (legacy)

The V1 code is preserved for reference. Key differences from V2:

| Aspect | V1 (this repo) | V2 (canonsafe-v2) |
|--------|----------------|-------------------|
| Character Card | 3-pack (canon, legal, safety) | 5-pack (+visual identity, +audio identity) |
| Evaluation dimensions | 4 fixed (canon, voice, safety, legal) | 6+ configurable via critics framework |
| Modalities | Text only | Text, image, video, audio |
| Judge models | Single (OpenAI or Anthropic fallback) | Multi-provider parallel with bias mitigation |
| Frontend framework | React 18 + CRA | React 18 + Vite |
| Database | Alembic migrations | init_db() with idempotent ALTER TABLE |
| API prefix | `/api/v1/` | `/api/` |
| Deployment | `mash-ai-prod` / us-central1 | `tpgpt-prod` / us-east1 |

### V1 Build & Run (for reference only)

```bash
# Backend
source venv/bin/activate
uvicorn src.main:app --reload --port 8000

# Frontend
cd frontend && npm start  # port 3003

# Tests
pytest -v
```

### V1 Deployment URLs (legacy, may be inactive)

| Service | URL |
|---------|-----|
| Frontend | https://eaas-mu.vercel.app |
| Backend | https://mash-ai-backend-611530284830.us-central1.run.app |
| GCP Project | `mash-ai-prod` (us-central1) |

## Other Documentation in This Repo

| File | What It Is |
|------|-----------|
| `docs/PRD.md` | Original product requirements document |
| `docs/CHARACTER_DATA_TAXONOMY.md` | Character data structure taxonomy |
| `docs/JOURNEY_CHRONICLE.md` | Development history chronicle |
| `docs/USER_MANUAL.md` | V1 user manual |
| `docs/research/` | Prior art research (brand safety, C2PA, competitors, evals, regulatory) |
| `AGENTS.md` | Multi-agent architecture description |
| `PROJECT_STATE.md` | V1 project state snapshot |
| `DEPLOYMENT_GUIDE.md` | V1 deployment instructions |
