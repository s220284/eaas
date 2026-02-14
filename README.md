# CanonSafe — Evals-as-a-Service for Character IP Governance

**Multi-Dimensional Evaluation, Certification, and Continuous Governance of AI-Generated Content Across Modalities**

CanonSafe is the "Character Trust Layer" — a platform that enables IP owners (studios, game publishers, toy companies, consumer brands) to evaluate, certify, and continuously govern how autonomous AI agents portray their licensed characters across text, image, video, and audio.

## Repositories

| Repo | Purpose | Status |
|------|---------|--------|
| **[canonsafe-v2](https://github.com/s220284/canonsafe-v2)** | Production app (FastAPI + React) | Active |
| **[eaas](https://github.com/s220284/eaas)** (this repo) | Patent applications + V1 legacy code | Patents active, V1 archived |

## Production App

- **Frontend:** https://frontend-beta-ten-75.vercel.app
- **Backend:** https://canonsafe-v2-516559856008.us-east1.run.app
- **Stack:** Python/FastAPI, React 18/Vite, PostgreSQL (Cloud SQL), Cloud Run, Vercel

### Platform Scale

- 24 API route modules, 17 service modules, 31 database models, 24 frontend pages
- 74 Peppa Pig characters seeded with rich 5-pack data
- Live LLM evaluation via OpenAI + Anthropic with multi-provider bias mitigation

## Patent Applications

Both patents are in [`docs/`](docs/) and describe the complete CanonSafe system:

| Document | Claims | Figures |
|----------|--------|---------|
| [Method Patent](docs/PATENT_APPLICATION.md) | 42 (4 independent + 38 dependent) | 20 |
| [Provisional Patent](docs/PROVISIONAL_PATENT_APPLICATION.md) | 50 | 20 |

**Applicant:** Shelly Palmer / The Palmer Group

### 16 Patented Capabilities

1. **5-Pack Character Card** — Structured IP profile (canon, legal, safety, visual identity, audio identity) serving as evaluation reference standard
2. **Multi-Modal Evaluation Engine** — Text, image (GPT-4o vision), video, audio evaluation with modality-specific judge models
3. **Configurable Critics Framework** — Pluggable critics with dynamic prompt assembly from Character Card data, per-org/franchise/character weights
4. **Performer Consent Verification** — Automated scope checking (temporal, territorial, modality, usage, strike clause) as hard evaluation gate
5. **Agentic Pipeline Middleware** — Real-time evaluation within agent pipelines with policy actions: pass, regenerate, quarantine, escalate, block
6. **Continuous Improvement Flywheel** — Failure pattern detection, rubric refinement, agent feedback signals, improvement trajectories
7. **Franchise-Level Evaluation** — Cross-character consistency, world-building consistency, franchise health monitoring
8. **Scale Architecture** — Tiered evaluation, statistical sampling, queue-based processing, distributed judge dispatch
9. **Certification & Compliance** — Two-tier certification (base + CanonSafe Certified), structured data export (CSV/JSON)
10. **Taxonomy-Driven Configuration** — Hierarchical categories and tags with evaluation rules and severity levels
11. **Judge Bias Mitigation** — Multi-provider parallel execution (OpenAI + Anthropic) with inter-critic agreement analysis
12. **A/B Experimentation** — Controlled experiments with z-test and Welch's t-test statistical significance testing
13. **Adversarial Red-Teaming** — 5 attack categories (persona break, knowledge probe, safety bypass, boundary test, context manipulation)
14. **CI/CD Integration** — GitHub Actions workflows, batch evaluation triggers, automated deployment gates
15. **Cost Monitoring** — Per-critic token tracking, per-model pricing, cost analytics by model/critic/character/organization
16. **Webhook Events** — HMAC-SHA256 signed notifications with auto-deactivation after delivery failures

## How It Works

```
IP Owner defines Character Card (5-pack)
         │
         ▼
AI Agent generates content (any modality)
         │
         ▼
CanonSafe evaluates against Character Card
  ├─ Canon Fidelity Critic
  ├─ Voice Consistency Critic
  ├─ Brand Safety Critic
  ├─ Legal Compliance Critic
  ├─ Visual Identity Critic (images/video)
  ├─ Audio Identity Critic (audio/video)
  └─ Custom Critics (configurable)
         │
         ▼
Policy Action: pass │ regenerate │ quarantine │ escalate │ block
         │
         ▼
Results stored, webhooks fired, HITL review if needed
```

The Character Card is used exclusively as an **evaluation reference standard** — it is never provided to content-generating models.

## Documentation

| Document | Description |
|----------|-------------|
| [Method Patent](docs/PATENT_APPLICATION.md) | 42-claim method patent with detailed process flows |
| [Provisional Patent](docs/PROVISIONAL_PATENT_APPLICATION.md) | 50-claim provisional with full specification |
| [PRD](docs/PRD.md) | Original product requirements document |
| [Character Data Taxonomy](docs/CHARACTER_DATA_TAXONOMY.md) | Character data structure taxonomy |
| [Research](docs/research/) | Prior art research (brand safety, C2PA, competitors, evals, regulatory) |

## Prior Art Distinction

CanonSafe differs from existing solutions in key ways:

- **vs. Generic LLM Safety Tools** (OpenAI Moderation, Constitutional AI): We evaluate against character-specific canonical profiles, not universal safety rules
- **vs. Character AI Platforms** (Character.AI, Inworld): They generate content; we evaluate independently-generated content
- **vs. LLM Eval Platforms** (Braintrust, DeepEval, Promptfoo): We add 5-pack character profiles, performer consent verification, multi-provider bias mitigation, and agentic middleware
- **vs. Brand Safety Scoring** (Seekr, IAS, DoubleVerify): They use universal advertising taxonomies; we use IP owner-defined character-specific profiles

---

Built by [The Palmer Group](https://www.shellypalmer.com) for the Character Trust Layer initiative.
