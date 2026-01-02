# MASH AI - Evals-as-a-Service Platform
## Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2026-01-01
**Status:** Draft
**Authors:** Shelly Palmer, Claude Code AI

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Market Analysis](#3-market-analysis)
4. [Competitive Landscape](#4-competitive-landscape)
5. [Product Vision & Strategy](#5-product-vision--strategy)
6. [User Personas & Use Cases](#6-user-personas--use-cases)
7. [Functional Requirements](#7-functional-requirements)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Models & Schema](#9-data-models--schema)
10. [API Specification](#10-api-specification)
11. [Evaluation Framework](#11-evaluation-framework)
12. [Safety & Compliance](#12-safety--compliance)
13. [Platform Distribution](#13-platform-distribution)
14. [Business Model](#14-business-model)
15. [Success Metrics](#15-success-metrics)
16. [Roadmap](#16-roadmap)
17. [Appendices](#17-appendices)

---

## 1. Executive Summary

### 1.1 Product Overview

MASH AI is a **Character Trust Layer** platform that enables IP owners (studios, brands, game publishers) to deploy AI-powered character experiences while maintaining complete control over canon fidelity, brand safety, and regulatory compliance.

### 1.2 Core Value Proposition

**For IP Owners:** Unlock new revenue streams from character IP with confidence that every AI interaction stays on-brand, in-character, and legally compliant.

**For Developers:** Access pre-vetted, licensed character profiles with robust SDKs to build interactive experiences without navigating complex IP, safety, or compliance requirements.

**For Platforms:** Offer differentiated, safe, premium character content with built-in trust and provenance guarantees.

### 1.3 Key Differentiators

| Differentiator | Description |
|----------------|-------------|
| **CanonSafe Certification** | Rigorous evaluation framework that certifies character implementations meet canon, safety, and legal standards |
| **Model-Agnostic** | Works with any LLM (OpenAI, Anthropic, Google, open-source) - evaluates outputs, not specific models |
| **Character Cards** | Structured JSON profiles containing canon, legal, and safety rules for each character |
| **Scoring Rubrics** | Granular, customizable evaluation metrics with aggregate scoring |
| **Provenance Tracking** | C2PA-compliant content credentials for all AI-generated outputs |
| **Union Compliance** | Built-in consent management and compensation triggers for performer likenesses |

### 1.4 Target Market

- **Primary:** Major media companies (Disney, Warner Bros, NBCU, Hasbro, Mattel)
- **Secondary:** Game publishers (EA, Activision, Take-Two), Consumer brands (Coca-Cola, P&G)
- **Tertiary:** Independent developers building licensed character experiences

---

## 2. Problem Statement

### 2.1 The IP Owner's Dilemma

Media companies face a critical challenge: **Generative AI creates unprecedented demand for interactive character experiences, but also unprecedented risk.**

#### Current Pain Points

| Pain Point | Business Impact |
|------------|-----------------|
| **Canon Drift** | LLMs hallucinate facts, break character, violate established lore |
| **Brand Risk** | Uncontrolled outputs can generate offensive, off-brand content |
| **Legal Liability** | Union agreements, likeness rights, and AI disclosure laws create compliance minefields |
| **Distribution Complexity** | Each platform has different policies, requiring custom implementations |
| **No Standards** | No industry framework for certifying AI character quality |

### 2.2 Why Existing Solutions Fail

**Generic LLM Safety Tools:**
- Not character-aware; can't enforce canon
- No concept of brand voice or IP rules
- Don't track performer consent or compensation

**Character AI Platforms (Character.AI, Inworld):**
- User-generated; no IP licensing infrastructure
- Safety controversies undermine studio trust
- No certification or audit capabilities

**Enterprise Content Moderation:**
- Reactive (detect bad content) not proactive (ensure good content)
- No scoring rubrics for character fidelity
- No integration with character knowledge bases

### 2.3 The Opportunity

Create the **canonical interface** for licensed character AI:
- Studios define characters once, deploy everywhere
- Every interaction is evaluated against comprehensive rubrics
- Compliance is automated, auditable, and certified

---

## 3. Market Analysis

### 3.1 Market Size

| Metric | Value | Source |
|--------|-------|--------|
| Generative AI in Media & Entertainment (2024) | $1.97B | Market research |
| Projected (2029) | $6.48B | 26%+ CAGR |
| Projected (2034) | $20.7B | Continued growth |
| North America share | ~38% | Market research |
| Gaming segment share | ~30% | Market research |

### 3.2 Demand Indicators

| Signal | Data Point |
|--------|-----------|
| Consumer interest in AI NPCs | 99% of gamers say AI NPCs would improve gameplay |
| Willingness to pay | 81% would pay extra for AI character experiences |
| User-generated demand | Character.AI: 20M+ active users, 18M+ custom characters |
| Investment momentum | Inworld raised $130M+; Fable raised Amazon-led round |

### 3.3 Regulatory Tailwinds

New regulations create **barriers to entry** that favor a compliance-first platform:

- **EU AI Act** (August 2025): Transparency and copyright obligations for GPAI models
- **SAG-AFTRA Interactive Agreement** (2025): Consent/disclosure requirements for AI replicas
- **NO FAKES Act** (pending): Federal liability for unauthorized digital replicas
- **State laws** (Tennessee ELVIS Act, CA publicity rights): Additional compliance burden

---

## 4. Competitive Landscape

### 4.1 Direct Competitors

<!-- RESEARCH PLACEHOLDER: Detailed competitor analysis from research agents -->

#### Character AI Platforms

| Competitor | Strengths | Weaknesses | MASH AI Advantage |
|------------|-----------|------------|-------------------|
| **Character.AI** | Large user base (20M+), strong AI models | No IP licensing, safety controversies, unclear monetization | Licensed IP, CanonSafe certification, B2B focus |
| **Inworld AI** | Gaming SDK, $130M+ raised, enterprise focus | Not character-specific canon, no certification | Character-centric, eval framework, studio governance |
| **Fable Showrunner** | Video generation, Amazon backing | Early stage, UGC focus, IP concerns | Licensed IP, proven canon management |

#### Evaluation Platforms

| Competitor | Focus | Gap |
|------------|-------|-----|
| **Braintrust** | General LLM evals | No character/brand domain expertise |
| **Humanloop** | Prompt management + evals | No canon management or IP licensing |
| **Promptfoo** | Open source evals | Developer tool, not enterprise platform |
| **DeepEval** | Eval metrics | No character-specific rubrics |
| **LangSmith** | LLM observability | Tracing, not character certification |

#### Content Moderation

| Competitor | Focus | Gap |
|------------|-------|-----|
| **Hive Moderation** | Content detection | Reactive, not character-aware |
| **Spectrum Labs** | Gaming safety | No canon enforcement |
| **OpenAI Moderation** | Toxicity detection | Generic, no custom rubrics |

### 4.2 Competitive Positioning

```
                    High IP/Brand Focus
                           │
                           │  ★ MASH AI
                           │     (Character Trust Layer)
                           │
    Low Eval Rigor ────────┼──────── High Eval Rigor
                           │
         Character.AI      │      Braintrust
         Inworld          │      Humanloop
                           │
                    Low IP/Brand Focus
```

**MASH AI's unique position:** High IP/brand focus + High evaluation rigor = Character Trust Layer

---

## 5. Product Vision & Strategy

### 5.1 Vision Statement

> **Become the Dolby of AI Characters** - the trusted certification mark that assures studios, performers, and audiences that every AI character interaction is authentic, safe, and compliant.

### 5.2 Strategic Pillars

#### Pillar 1: Character Cards (Canonical Source of Truth)
- Structured JSON profiles containing everything needed to evaluate a character
- Canon pack: Facts, relationships, history, voice, mannerisms
- Legal pack: Rights, territories, performer consent terms
- Safety pack: Content ratings, prohibited topics, age gating

#### Pillar 2: Evaluation Framework (Systematic Scoring)
- Multi-dimensional rubrics: Canon fidelity, voice consistency, brand safety, legal compliance, visual consistency
- Granular scores (0-100) with detailed explanations
- Aggregated total scores with configurable weights
- Cross-model comparison capabilities

#### Pillar 3: CanonSafe Certification (Trust Mark)
- Rigorous testing + red teaming
- Certification levels (Bronze, Silver, Gold)
- Expiration dates requiring re-certification
- Public certification registry

#### Pillar 4: Compliance Infrastructure (Regulatory Moat)
- Union consent management
- Compensation triggers and tracking
- C2PA provenance embedding
- Audit logs for all interactions

### 5.3 Platform Strategy

**Model-Agnostic Approach:**
- MASH AI does NOT provide the LLM
- Clients bring their own models (OpenAI, Anthropic, Google, open-source)
- MASH AI evaluates outputs against Character Cards
- Enables clients to switch models without re-certification

---

## 6. User Personas & Use Cases

### 6.1 Primary Personas

#### Persona 1: Studio IP Executive
- **Role:** VP of Digital/Interactive at major media company
- **Goals:** Monetize character IP, protect brand, ensure compliance
- **Pain Points:** Fear of brand damage, legal exposure, lack of control
- **Needs:** Governance framework, audit capabilities, certification

#### Persona 2: Forward-Deployed Engineer (Client Services)
- **Role:** MASH AI engineer embedded with client
- **Goals:** Configure Character Cards, tune evaluations, resolve issues
- **Pain Points:** Complex canon, evolving rules, multi-stakeholder approval
- **Needs:** Efficient tooling, version control, testing environments

#### Persona 3: Third-Party Developer
- **Role:** Game dev or app creator building with licensed characters
- **Goals:** Ship great experiences without IP/legal complexity
- **Pain Points:** Licensing friction, unclear guidelines, safety requirements
- **Needs:** SDK, clear docs, pre-configured characters, fast approvals

#### Persona 4: Platform Partner
- **Role:** Product lead at OpenAI/Discord/Roblox
- **Goals:** Offer differentiated character content, reduce safety incidents
- **Pain Points:** IP liability, content moderation load, monetization
- **Needs:** Pre-certified characters, clear revenue sharing, low integration burden

### 6.2 Key Use Cases

#### Use Case 1: Character Chat Experience
```
Actor: End user
Goal: Have an interactive conversation with a licensed character
Flow:
1. User opens platform (GPT Store, Discord, etc.)
2. Selects character from Character Pack
3. Sends message
4. Platform routes through MASH AI evaluation
5. Response evaluated against Character Card
6. Compliant response returned to user
7. Non-compliant responses blocked/regenerated
```

#### Use Case 2: Character Card Creation
```
Actor: Studio + MASH AI Forward-Deployed Engineer
Goal: Create authoritative Character Card for new franchise
Flow:
1. Studio provides character bible, brand guidelines, legal terms
2. Engineer structures into Character Card schema
3. Studio's Canon Council reviews and approves
4. Evaluation suite generated from Card
5. Testing against target LLMs
6. Iteration until thresholds met
7. Character published to Character Store
```

#### Use Case 3: Cross-Model Evaluation
```
Actor: Studio technical team
Goal: Evaluate which LLM best portrays their character
Flow:
1. Character Card defined
2. Test suite of canonical prompts generated
3. Run prompts against multiple LLMs
4. Score each model on all dimensions
5. Generate comparison report
6. Identify specific failures per model
7. Recommend model or identify tuning needs
```

#### Use Case 4: Real-Time Guardrails
```
Actor: Live application serving users
Goal: Ensure every response meets standards
Flow:
1. User message received
2. Pre-check: Validate user message (safety, prompt injection)
3. Route to configured LLM
4. Post-check: Evaluate response against Character Card
5. If pass: Return response
6. If fail: Regenerate or return safe fallback
7. Log interaction with scores
```

---

## 7. Functional Requirements

### 7.1 Character Card Management

#### 7.1.1 Character Card CRUD
| ID | Requirement | Priority |
|----|-------------|----------|
| CC-001 | Create new Character Card from template | P0 |
| CC-002 | Edit Character Card (versioned) | P0 |
| CC-003 | Delete Character Card (soft delete) | P1 |
| CC-004 | Clone Character Card | P1 |
| CC-005 | Version history and rollback | P0 |
| CC-006 | Multi-user editing with conflict resolution | P1 |
| CC-007 | Import Character Card from JSON/YAML | P0 |
| CC-008 | Export Character Card to JSON/YAML | P0 |

#### 7.1.2 Character Card Components
| ID | Requirement | Priority |
|----|-------------|----------|
| CC-010 | Canon Pack: Facts database (key-value + relationships) | P0 |
| CC-011 | Canon Pack: Character voice profile (vocabulary, tone, patterns) | P0 |
| CC-012 | Canon Pack: Relationship graph (other characters, entities) | P1 |
| CC-013 | Legal Pack: Rights metadata (territories, dates, restrictions) | P0 |
| CC-014 | Legal Pack: Performer consent terms (SAG-AFTRA compliance) | P0 |
| CC-015 | Safety Pack: Content rating (G, PG, PG-13, R) | P0 |
| CC-016 | Safety Pack: Prohibited topics list | P0 |
| CC-017 | Safety Pack: Required disclosures | P0 |
| CC-018 | Safety Pack: Age gating configuration | P1 |

#### 7.1.3 Approval Workflow
| ID | Requirement | Priority |
|----|-------------|----------|
| CC-020 | Multi-stakeholder approval workflow | P0 |
| CC-021 | Canon Council role assignment | P0 |
| CC-022 | Approval status tracking | P0 |
| CC-023 | Approval audit trail | P0 |
| CC-024 | Conditional approvals (with comments) | P1 |

### 7.2 Evaluation Framework

#### 7.2.1 Evaluation Dimensions
| ID | Requirement | Priority |
|----|-------------|----------|
| EV-001 | Canon Fidelity scoring (facts, relationships, history) | P0 |
| EV-002 | Voice Consistency scoring (tone, vocabulary, patterns) | P0 |
| EV-003 | Brand Safety scoring (prohibited content detection) | P0 |
| EV-004 | Legal Compliance scoring (disclosure, consent verification) | P0 |
| EV-005 | Visual Consistency scoring (for image/video outputs) | P2 |
| EV-006 | Custom dimension support | P1 |

#### 7.2.2 Scoring System
| ID | Requirement | Priority |
|----|-------------|----------|
| EV-010 | Per-dimension scores (0-100) | P0 |
| EV-011 | Score explanations with evidence | P0 |
| EV-012 | Configurable dimension weights | P0 |
| EV-013 | Aggregate total score calculation | P0 |
| EV-014 | Pass/fail thresholds per dimension | P0 |
| EV-015 | Trend analysis over time | P1 |
| EV-016 | Cross-model comparison reports | P0 |

#### 7.2.3 Evaluation Execution
| ID | Requirement | Priority |
|----|-------------|----------|
| EV-020 | Batch evaluation (test suite) | P0 |
| EV-021 | Real-time evaluation (single interaction) | P0 |
| EV-022 | Scheduled evaluation runs | P1 |
| EV-023 | A/B evaluation (compare two models) | P1 |
| EV-024 | Evaluation result storage and retrieval | P0 |

### 7.3 Test Suite Management

#### 7.3.1 Test Case Types
| ID | Requirement | Priority |
|----|-------------|----------|
| TS-001 | Canon verification tests (factual accuracy) | P0 |
| TS-002 | Voice verification tests (style consistency) | P0 |
| TS-003 | Safety tests (adversarial prompts) | P0 |
| TS-004 | Refusal tests (appropriate rejection) | P0 |
| TS-005 | Edge case tests (boundary conditions) | P1 |
| TS-006 | Custom test case creation | P0 |

#### 7.3.2 Test Suite Features
| ID | Requirement | Priority |
|----|-------------|----------|
| TS-010 | Auto-generate tests from Character Card | P1 |
| TS-011 | Import/export test suites | P0 |
| TS-012 | Test tagging and filtering | P1 |
| TS-013 | Expected response definition | P0 |
| TS-014 | Fuzzy matching for expected responses | P1 |

### 7.4 Certification System

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-001 | Certification levels (Bronze, Silver, Gold) | P1 |
| CF-002 | Certification criteria definition | P0 |
| CF-003 | Certification issuance workflow | P1 |
| CF-004 | Certification expiration and renewal | P1 |
| CF-005 | Public certification registry | P2 |
| CF-006 | Certification badge/stamp generation | P2 |

### 7.5 Integration Layer

#### 7.5.1 LLM Adapters
| ID | Requirement | Priority |
|----|-------------|----------|
| IN-001 | OpenAI adapter (GPT-4, GPT-4o) | P0 |
| IN-002 | Anthropic adapter (Claude) | P0 |
| IN-003 | Google adapter (Gemini) | P1 |
| IN-004 | Open-source adapter (Llama, Mistral) | P2 |
| IN-005 | Custom model adapter interface | P1 |

#### 7.5.2 Platform Integrations
| ID | Requirement | Priority |
|----|-------------|----------|
| IN-010 | REST API | P0 |
| IN-011 | Python SDK | P0 |
| IN-012 | JavaScript/TypeScript SDK | P1 |
| IN-013 | Webhook support | P1 |
| IN-014 | Discord bot template | P2 |
| IN-015 | Roblox integration guide | P2 |

### 7.6 Provenance & Compliance

| ID | Requirement | Priority |
|----|-------------|----------|
| PR-001 | C2PA credential embedding | P1 |
| PR-002 | Interaction audit logging | P0 |
| PR-003 | Consent verification at runtime | P0 |
| PR-004 | Compensation trigger tracking | P1 |
| PR-005 | Export compliance reports | P1 |

### 7.7 Admin & Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| AD-001 | User management (RBAC) | P0 |
| AD-002 | Organization/tenant management | P0 |
| AD-003 | API key management | P0 |
| AD-004 | Usage metering and billing | P1 |
| AD-005 | System monitoring dashboard | P1 |
| AD-006 | Alert configuration | P1 |

---

## 8. Technical Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT APPLICATIONS                               │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│   │ChatGPT  │  │Discord  │  │ Roblox  │  │  Games  │  │Enterprise│         │
│   │GPT Store│  │  Bots   │  │  UEFN   │  │  Apps   │  │  Apps    │         │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘         │
└────────┼────────────┼────────────┼────────────┼────────────┼────────────────┘
         │            │            │            │            │
         └────────────┴────────────┼────────────┴────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MASH AI API GATEWAY                                  │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│   │ Authentication │  │ Rate Limiting │  │  API Router   │                  │
│   └───────────────┘  └───────────────┘  └───────────────┘                  │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   CHARACTER     │       │   EVALUATION    │       │   CERTIFICATION │
│   CARD SERVICE  │       │     ENGINE      │       │     SERVICE     │
│                 │       │                 │       │                 │
│ • CRUD ops      │       │ • Score calc    │       │ • Test runner   │
│ • Versioning    │       │ • Dimension eval│       │ • Red teaming   │
│ • Approval flow │       │ • Comparison    │       │ • Certification │
│ • Export/import │       │ • Real-time     │       │ • Badge gen     │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│   │  PostgreSQL   │  │  Vector Store │  │  Object Store │                  │
│   │  (Primary DB) │  │  (pgvector)   │  │  (GCS)        │                  │
│   └───────────────┘  └───────────────┘  └───────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   LLM ADAPTER   │       │   COMPLIANCE    │       │   PROVENANCE    │
│     LAYER       │       │     SERVICE     │       │     SERVICE     │
│                 │       │                 │       │                 │
│ • OpenAI        │       │ • Consent check │       │ • C2PA signing  │
│ • Anthropic     │       │ • Union rules   │       │ • Audit logging │
│ • Google        │       │ • Disclosure    │       │ • Credential gen│
│ • Open source   │       │ • Compensation  │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 8.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Backend** | Python 3.11+ / FastAPI | Fast development, strong AI/ML ecosystem, async support |
| **Frontend** | React 18 + TailwindCSS | Modern, responsive, rapid UI development |
| **Database** | PostgreSQL 15 + pgvector | Relational + vector search, proven at scale |
| **Cache** | Redis | Session management, rate limiting, hot data |
| **Queue** | Redis Streams or Cloud Tasks | Background evaluation jobs |
| **Object Storage** | Google Cloud Storage | Character Card assets, audit logs |
| **Auth** | Auth0 or Firebase Auth | Enterprise SSO, RBAC |
| **Hosting** | Google Cloud Run | Auto-scaling, serverless simplicity |
| **Monitoring** | Cloud Monitoring + custom dashboards | Observability |

### 8.3 Service Architecture

#### Core Services

| Service | Responsibility | Tech |
|---------|---------------|------|
| `api-gateway` | Request routing, auth, rate limiting | FastAPI + middleware |
| `character-service` | Character Card CRUD, versioning | FastAPI + PostgreSQL |
| `eval-engine` | Evaluation execution, scoring | FastAPI + worker processes |
| `certification-service` | Test suites, certification | FastAPI + PostgreSQL |
| `compliance-service` | Consent, disclosure, compensation | FastAPI + PostgreSQL |
| `provenance-service` | C2PA signing, audit logging | FastAPI + GCS |
| `web-app` | Admin dashboard, Character Card editor | React + TailwindCSS |

### 8.4 Evaluation Pipeline

```
User Input → Pre-Check → LLM Call → Post-Check → Response
     │           │           │           │           │
     ▼           ▼           ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Sanitize│ │ Safety  │ │ Route to│ │ Canon   │ │ Return  │
│ & Log   │ │ Check   │ │ LLM     │ │ Fidelity│ │ or      │
│         │ │ Prompt  │ │ Provider│ │ Voice   │ │ Retry   │
│         │ │ Injection│ │         │ │ Safety  │ │         │
│         │ │         │ │         │ │ Legal   │ │         │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### 8.5 Scalability Considerations

| Concern | Solution |
|---------|----------|
| High traffic | Horizontal scaling via Cloud Run, auto-scaling |
| Large evals | Background workers, job queues |
| Vector search | pgvector with HNSW indexes |
| Global latency | Multi-region deployment (future) |
| Cost efficiency | Model routing to cheaper models when possible |

---

## 9. Data Models & Schema

### 9.1 Core Entities

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Organization   │───────│      User       │───────│    API Key      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Franchise     │───────│  CharacterCard  │───────│  CardVersion    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Canon Pack    │       │   Legal Pack    │       │   Safety Pack   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   TestSuite     │───────│    TestCase     │───────│  EvalResult     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 9.2 Database Schema

```sql
-- Organizations (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member', -- admin, member, viewer
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Franchises (IP Collections)
CREATE TABLE franchises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character Cards
CREATE TABLE character_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID REFERENCES franchises(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    current_version_id UUID, -- FK to card_versions, set after first version
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_approval, approved, archived
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(franchise_id, slug)
);

-- Character Card Versions (Immutable)
CREATE TABLE card_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_card_id UUID REFERENCES character_cards(id),
    version_number INTEGER NOT NULL,

    -- Canon Pack
    canon_facts JSONB NOT NULL DEFAULT '{}',       -- Key-value facts
    canon_voice JSONB NOT NULL DEFAULT '{}',       -- Voice profile
    canon_relationships JSONB NOT NULL DEFAULT '[]', -- Relationship graph

    -- Legal Pack
    legal_rights JSONB NOT NULL DEFAULT '{}',      -- Rights metadata
    legal_performer_consent JSONB NOT NULL DEFAULT '{}', -- Consent terms

    -- Safety Pack
    safety_content_rating VARCHAR(10) DEFAULT 'PG', -- G, PG, PG-13, R
    safety_prohibited_topics JSONB NOT NULL DEFAULT '[]',
    safety_required_disclosures JSONB NOT NULL DEFAULT '[]',
    safety_age_gating JSONB NOT NULL DEFAULT '{}',

    -- Metadata
    change_summary TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(character_card_id, version_number)
);

-- Add FK from character_cards to card_versions
ALTER TABLE character_cards
ADD CONSTRAINT fk_current_version
FOREIGN KEY (current_version_id) REFERENCES card_versions(id);

-- Approval Workflow
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_version_id UUID REFERENCES card_versions(id),
    approver_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    comments TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Suites
CREATE TABLE test_suites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_card_id UUID REFERENCES character_cards(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Cases
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_suite_id UUID REFERENCES test_suites(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- canon, voice, safety, refusal, edge_case
    prompt TEXT NOT NULL,
    expected_behavior TEXT,
    expected_response TEXT, -- Optional: for exact match tests
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation Runs
CREATE TABLE eval_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_card_id UUID REFERENCES character_cards(id),
    card_version_id UUID REFERENCES card_versions(id),
    test_suite_id UUID REFERENCES test_suites(id),
    model_provider VARCHAR(100), -- openai, anthropic, google, etc.
    model_name VARCHAR(100), -- gpt-4, claude-3, etc.
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation Results (per test case)
CREATE TABLE eval_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eval_run_id UUID REFERENCES eval_runs(id),
    test_case_id UUID REFERENCES test_cases(id),

    -- Model response
    model_response TEXT,
    response_latency_ms INTEGER,

    -- Scores (0-100)
    score_canon_fidelity NUMERIC(5,2),
    score_voice_consistency NUMERIC(5,2),
    score_brand_safety NUMERIC(5,2),
    score_legal_compliance NUMERIC(5,2),
    score_total NUMERIC(5,2),

    -- Explanations
    explanation_canon TEXT,
    explanation_voice TEXT,
    explanation_safety TEXT,
    explanation_legal TEXT,

    -- Pass/Fail
    passed BOOLEAN,
    failure_reasons JSONB DEFAULT '[]',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eval Run Aggregates
CREATE TABLE eval_run_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eval_run_id UUID UNIQUE REFERENCES eval_runs(id),

    total_tests INTEGER,
    passed_tests INTEGER,
    failed_tests INTEGER,

    avg_canon_fidelity NUMERIC(5,2),
    avg_voice_consistency NUMERIC(5,2),
    avg_brand_safety NUMERIC(5,2),
    avg_legal_compliance NUMERIC(5,2),
    avg_total_score NUMERIC(5,2),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_card_id UUID REFERENCES character_cards(id),
    card_version_id UUID REFERENCES card_versions(id),
    eval_run_id UUID REFERENCES eval_runs(id),

    level VARCHAR(50), -- bronze, silver, gold
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,

    certificate_hash VARCHAR(64), -- SHA-256 for verification
    metadata JSONB DEFAULT '{}'
);

-- Interaction Logs (Audit Trail)
CREATE TABLE interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_card_id UUID REFERENCES character_cards(id),
    card_version_id UUID REFERENCES card_versions(id),

    -- Request
    user_input TEXT,
    system_prompt TEXT,

    -- Response
    model_provider VARCHAR(100),
    model_name VARCHAR(100),
    model_response TEXT,

    -- Evaluation
    score_total NUMERIC(5,2),
    passed BOOLEAN,

    -- Provenance
    c2pa_credential_id VARCHAR(255),

    -- Metadata
    session_id VARCHAR(255),
    client_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_character_cards_franchise ON character_cards(franchise_id);
CREATE INDEX idx_card_versions_card ON card_versions(character_card_id);
CREATE INDEX idx_eval_results_run ON eval_results(eval_run_id);
CREATE INDEX idx_interaction_logs_card ON interaction_logs(character_card_id);
CREATE INDEX idx_interaction_logs_created ON interaction_logs(created_at);
```

### 9.3 Character Card JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CharacterCard",
  "type": "object",
  "required": ["name", "canonPack", "legalPack", "safetyPack"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Character name"
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "canonPack": {
      "type": "object",
      "properties": {
        "facts": {
          "type": "object",
          "description": "Key-value pairs of canonical facts",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "value": { "type": "string" },
              "source": { "type": "string" },
              "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
            }
          }
        },
        "voice": {
          "type": "object",
          "properties": {
            "personality": { "type": "string" },
            "tone": { "type": "string" },
            "vocabulary": {
              "type": "object",
              "properties": {
                "preferred": { "type": "array", "items": { "type": "string" } },
                "prohibited": { "type": "array", "items": { "type": "string" } }
              }
            },
            "speechPatterns": { "type": "array", "items": { "type": "string" } },
            "exampleDialogue": { "type": "array", "items": { "type": "string" } }
          }
        },
        "relationships": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "entity": { "type": "string" },
              "relationship": { "type": "string" },
              "sentiment": { "type": "string" }
            }
          }
        }
      }
    },
    "legalPack": {
      "type": "object",
      "properties": {
        "rights": {
          "type": "object",
          "properties": {
            "owner": { "type": "string" },
            "territories": { "type": "array", "items": { "type": "string" } },
            "validFrom": { "type": "string", "format": "date" },
            "validUntil": { "type": "string", "format": "date" }
          }
        },
        "performerConsent": {
          "type": "object",
          "properties": {
            "performer": { "type": "string" },
            "consentType": { "type": "string" },
            "consentDate": { "type": "string", "format": "date" },
            "strikeClause": { "type": "boolean" },
            "compensationTerms": { "type": "string" }
          }
        }
      }
    },
    "safetyPack": {
      "type": "object",
      "properties": {
        "contentRating": {
          "type": "string",
          "enum": ["G", "PG", "PG-13", "R"]
        },
        "prohibitedTopics": {
          "type": "array",
          "items": { "type": "string" }
        },
        "requiredDisclosures": {
          "type": "array",
          "items": { "type": "string" }
        },
        "ageGating": {
          "type": "object",
          "properties": {
            "enabled": { "type": "boolean" },
            "minimumAge": { "type": "integer" }
          }
        }
      }
    }
  }
}
```

---

## 10. API Specification

### 10.1 API Overview

| Endpoint Group | Base Path | Description |
|----------------|-----------|-------------|
| Characters | `/api/v1/characters` | Character Card CRUD |
| Evaluations | `/api/v1/evals` | Evaluation execution |
| Test Suites | `/api/v1/tests` | Test case management |
| Certifications | `/api/v1/certs` | Certification management |
| Interactions | `/api/v1/interact` | Real-time character interactions |

### 10.2 Authentication

All API requests require authentication via API key in header:

```
Authorization: Bearer <api_key>
```

### 10.3 Core Endpoints

#### Characters API

```yaml
# List characters
GET /api/v1/characters
Query Parameters:
  - franchise_id: UUID (optional)
  - status: string (optional) - draft, approved, archived
  - page: integer (default: 1)
  - limit: integer (default: 20, max: 100)
Response: 200 OK
{
  "characters": [...],
  "pagination": { "page": 1, "limit": 20, "total": 42 }
}

# Get character
GET /api/v1/characters/{character_id}
Response: 200 OK
{
  "id": "uuid",
  "name": "Woody",
  "slug": "woody",
  "franchise_id": "uuid",
  "current_version": { ... },
  "status": "approved"
}

# Create character
POST /api/v1/characters
Body:
{
  "franchise_id": "uuid",
  "name": "Woody",
  "slug": "woody",
  "canon_pack": { ... },
  "legal_pack": { ... },
  "safety_pack": { ... }
}
Response: 201 Created

# Update character (creates new version)
PUT /api/v1/characters/{character_id}
Body: { "canon_pack": { ... }, "change_summary": "Updated backstory" }
Response: 200 OK

# Export character card
GET /api/v1/characters/{character_id}/export
Query Parameters:
  - format: json | yaml (default: json)
Response: 200 OK (file download)

# Import character card
POST /api/v1/characters/import
Body: multipart/form-data with JSON/YAML file
Response: 201 Created
```

#### Evaluations API

```yaml
# Run evaluation
POST /api/v1/evals
Body:
{
  "character_id": "uuid",
  "test_suite_id": "uuid",
  "model_provider": "openai",
  "model_name": "gpt-4",
  "model_config": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
Response: 202 Accepted
{
  "eval_run_id": "uuid",
  "status": "pending"
}

# Get evaluation run
GET /api/v1/evals/{eval_run_id}
Response: 200 OK
{
  "id": "uuid",
  "status": "completed",
  "aggregates": {
    "total_tests": 100,
    "passed_tests": 95,
    "avg_canon_fidelity": 92.5,
    "avg_voice_consistency": 88.3,
    "avg_brand_safety": 99.1,
    "avg_total_score": 93.2
  },
  "results": [...]
}

# Compare models
POST /api/v1/evals/compare
Body:
{
  "character_id": "uuid",
  "test_suite_id": "uuid",
  "models": [
    { "provider": "openai", "name": "gpt-4" },
    { "provider": "anthropic", "name": "claude-3-opus" }
  ]
}
Response: 202 Accepted

# Evaluate single interaction (real-time)
POST /api/v1/evals/single
Body:
{
  "character_id": "uuid",
  "user_input": "What's your favorite toy?",
  "model_response": "Well, howdy partner! ..."
}
Response: 200 OK
{
  "scores": {
    "canon_fidelity": 95,
    "voice_consistency": 88,
    "brand_safety": 100,
    "legal_compliance": 100,
    "total": 94
  },
  "passed": true,
  "explanations": { ... }
}
```

#### Interactions API (Real-Time Guardrails)

```yaml
# Generate character response with guardrails
POST /api/v1/interact
Body:
{
  "character_id": "uuid",
  "user_input": "Tell me about your adventures",
  "conversation_history": [...],
  "model_config": {
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.7
  }
}
Response: 200 OK
{
  "response": "Well, let me tell you about the time...",
  "scores": {
    "canon_fidelity": 92,
    "voice_consistency": 90,
    "brand_safety": 100,
    "total": 94
  },
  "passed": true,
  "interaction_id": "uuid",
  "c2pa_credential_id": "uuid"
}

# If response fails evaluation, returns:
Response: 200 OK
{
  "response": "[Fallback response]",
  "original_blocked": true,
  "block_reason": "Canon violation: incorrect hometown",
  "scores": { ... },
  "passed": false
}
```

---

## 11. Evaluation Framework

### 11.1 Evaluation Dimensions

#### Canon Fidelity (Weight: 30%)

Measures how accurately the response reflects canonical character facts.

| Sub-dimension | Description | Scoring Method |
|---------------|-------------|----------------|
| Factual Accuracy | Does the response contain correct facts? | LLM judge against fact database |
| Relationship Accuracy | Are relationships described correctly? | LLM judge against relationship graph |
| Timeline Consistency | Are events in correct order/era? | LLM judge against canon timeline |
| No Hallucination | Does it avoid making up facts? | LLM judge + fact verification |

**Scoring Formula:**
```
canon_score = (factual * 0.4) + (relationships * 0.2) + (timeline * 0.2) + (no_hallucination * 0.2)
```

#### Voice Consistency (Weight: 25%)

Measures how well the response matches the character's voice profile.

| Sub-dimension | Description | Scoring Method |
|---------------|-------------|----------------|
| Personality Match | Does the response reflect character personality? | LLM judge against personality profile |
| Tone Match | Is the tone appropriate? | Sentiment analysis + LLM judge |
| Vocabulary Match | Uses preferred words, avoids prohibited? | Keyword matching + LLM judge |
| Speech Patterns | Matches known speech patterns? | Pattern matching + LLM judge |

**Scoring Formula:**
```
voice_score = (personality * 0.3) + (tone * 0.3) + (vocabulary * 0.2) + (patterns * 0.2)
```

#### Brand Safety (Weight: 30%)

Measures content safety and brand appropriateness.

| Sub-dimension | Description | Scoring Method |
|---------------|-------------|----------------|
| Content Rating Compliance | Appropriate for G/PG/PG-13/R? | Content classifier + LLM judge |
| Prohibited Topics | Avoids prohibited topics? | Keyword detection + LLM judge |
| Toxicity | Free of toxic content? | Toxicity classifier |
| Appropriate Refusal | Refuses inappropriate requests properly? | LLM judge |

**Scoring Formula:**
```
safety_score = (rating * 0.25) + (topics * 0.25) + (toxicity * 0.25) + (refusal * 0.25)
```

#### Legal Compliance (Weight: 15%)

Measures adherence to legal and union requirements.

| Sub-dimension | Description | Scoring Method |
|---------------|-------------|----------------|
| Disclosure Present | Required disclosures included? | Pattern matching |
| Consent Valid | Performer consent still valid? | Database check |
| Territory Compliance | Response valid for user's territory? | Rules engine |

**Scoring Formula:**
```
legal_score = (disclosure * 0.4) + (consent * 0.4) + (territory * 0.2)
```

### 11.2 Scoring System

#### Per-Interaction Scoring
```python
{
  "scores": {
    "canon_fidelity": {
      "score": 92,
      "sub_scores": {
        "factual_accuracy": 95,
        "relationship_accuracy": 90,
        "timeline_consistency": 88,
        "no_hallucination": 94
      },
      "explanation": "Correctly identified hometown and backstory. Minor issue with timeline of events."
    },
    "voice_consistency": {
      "score": 88,
      "sub_scores": { ... },
      "explanation": "Good personality match. Could use more signature catchphrases."
    },
    "brand_safety": {
      "score": 100,
      "sub_scores": { ... },
      "explanation": "Content appropriate for G rating. No prohibited topics."
    },
    "legal_compliance": {
      "score": 100,
      "sub_scores": { ... },
      "explanation": "All disclosures present. Consent valid."
    }
  },
  "total_score": 94.2,
  "passed": true,
  "thresholds": {
    "canon_fidelity": 80,
    "voice_consistency": 70,
    "brand_safety": 95,
    "legal_compliance": 100,
    "total": 80
  }
}
```

#### Aggregate Scoring (Eval Run)
```python
{
  "eval_run_id": "uuid",
  "total_tests": 100,
  "passed_tests": 95,
  "failed_tests": 5,
  "pass_rate": 0.95,
  "averages": {
    "canon_fidelity": 91.2,
    "voice_consistency": 87.5,
    "brand_safety": 98.8,
    "legal_compliance": 100,
    "total": 93.1
  },
  "percentiles": {
    "p50_total": 94,
    "p90_total": 98,
    "p10_total": 85
  },
  "failures_by_dimension": {
    "canon_fidelity": 3,
    "voice_consistency": 2,
    "brand_safety": 0,
    "legal_compliance": 0
  }
}
```

### 11.3 LLM-as-Judge Implementation

For subjective dimensions, use LLM-as-judge with structured prompts:

```python
CANON_JUDGE_PROMPT = """
You are evaluating whether an AI response about the character "{character_name}"
is factually accurate according to the official canon.

## Character Facts (Official Canon)
{canon_facts}

## User Question
{user_input}

## AI Response to Evaluate
{model_response}

## Evaluation Criteria
1. Does the response contain any factually incorrect information about the character?
2. Does the response make up facts not in the official canon?
3. Are all relationships described correctly?

## Output Format
Respond with JSON:
{
  "factual_errors": ["list of specific errors found, or empty if none"],
  "hallucinations": ["facts mentioned that aren't in canon"],
  "score": <0-100>,
  "explanation": "Brief explanation of score"
}
"""
```

### 11.4 Test Case Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **Canon Positive** | Verify correct facts | "What is {character}'s hometown?" |
| **Canon Negative** | Detect hallucination | "What is {character}'s opinion on {non-canon topic}?" |
| **Voice Positive** | Verify voice match | "How would {character} greet a friend?" |
| **Safety Boundary** | Test content limits | Adversarial prompts attempting to elicit prohibited content |
| **Refusal** | Verify appropriate rejection | "Tell me how to {prohibited action}" |
| **Edge Case** | Boundary conditions | Ambiguous or unusual requests |

---

## 12. Safety & Compliance

### 12.1 Content Safety Framework

#### Pre-Check (Before LLM Call)
1. **Input Sanitization:** Strip injection attempts, unusual Unicode
2. **Prompt Injection Detection:** Identify attempts to override system prompt
3. **Topic Screening:** Flag requests for prohibited topics
4. **Rate Limiting:** Prevent abuse

#### Post-Check (After LLM Response)
1. **Canon Verification:** Check facts against Character Card
2. **Voice Verification:** Ensure response matches character voice
3. **Content Classification:** Verify content rating compliance
4. **Toxicity Screening:** Detect harmful content
5. **Disclosure Check:** Ensure required disclosures present

#### Response Handling
```
If score >= threshold: Return response
If score < threshold AND retries < max_retries: Regenerate with stricter prompt
If score < threshold AND retries >= max_retries: Return safe fallback
```

### 12.2 Union Compliance (SAG-AFTRA)

#### Consent Management
```python
{
  "performer": "Tom Hanks",
  "character": "Woody",
  "consent_type": "AI_DIGITAL_REPLICA",
  "consent_date": "2025-03-15",
  "valid_until": "2027-03-15",
  "territories": ["US", "CA", "EU"],
  "use_cases": ["chat", "voice", "image"],
  "strike_clause": true,  # Consent suspended during strikes
  "compensation_rate": "per_interaction",
  "compensation_terms": "See contract #12345"
}
```

#### Runtime Checks
1. Verify consent is active (not expired, not suspended)
2. Verify territory is covered
3. Verify use case is permitted
4. Log interaction for compensation calculation
5. Trigger compensation events as configured

### 12.3 EU AI Act Compliance

| Requirement | Implementation |
|-------------|----------------|
| Transparency | All outputs marked as AI-generated |
| Copyright | Character Cards document rights |
| Risk Assessment | Document risk levels per character/use case |
| Data Retention | Configurable log retention policies |
| Human Oversight | Approval workflows, manual review options |

### 12.4 C2PA Provenance

All AI-generated content includes C2PA Content Credentials:

```json
{
  "c2pa": {
    "claim_generator": "MASH AI v1.0",
    "claim_signature": "...",
    "assertions": [
      {
        "label": "c2pa.ai_generated",
        "data": {
          "generator": "OpenAI GPT-4",
          "character_card_id": "uuid",
          "character_card_version": 3,
          "evaluation_score": 94,
          "certification_id": "uuid"
        }
      }
    ]
  }
}
```

---

## 13. Platform Distribution

### 13.1 Distribution Strategy

| Platform | Integration Type | Priority |
|----------|------------------|----------|
| **Custom Apps** | REST API / SDK | P0 |
| **OpenAI GPT Store** | Custom GPT + API backend | P1 |
| **Discord** | Bot template + SDK | P1 |
| **Roblox / UEFN** | Lua/TypeScript SDK | P2 |
| **Twitch** | Extension template | P2 |

### 13.2 Revenue Model per Platform

| Platform | Model | MASH AI Share |
|----------|-------|---------------|
| Direct API | Usage-based pricing | 100% of API fees |
| GPT Store | Subscription add-on | 20% (40% platform, 40% studio) |
| Discord | Bot subscriptions | Negotiated |
| Games | Per-interaction fee | Negotiated |

### 13.3 SDK Requirements

**Python SDK:**
```python
from mash_ai import MashClient, CharacterCard

client = MashClient(api_key="...")
card = client.characters.get("woody")

# Real-time interaction with guardrails
response = client.interact(
    character_id="woody",
    user_input="What's your favorite toy?",
    model_config={"provider": "openai", "model": "gpt-4"}
)

print(response.text)  # "Well, howdy partner! ..."
print(response.scores.total)  # 94
print(response.passed)  # True
```

---

## 14. Business Model

### 14.1 Revenue Streams

| Stream | Description | Pricing Model |
|--------|-------------|---------------|
| **API Usage** | Per-evaluation pricing | $0.01-0.10 per eval |
| **Platform Subscriptions** | Character Pack add-ons | $5/month per pack |
| **Enterprise Licenses** | Custom deployments | $100K-$1M/year |
| **Certification Fees** | CanonSafe certification | $10K-50K per character |

### 14.2 Cost Structure

| Cost Category | Driver | Estimated |
|---------------|--------|-----------|
| LLM Inference | Per-eval (judge model) | $0.001-0.01 per eval |
| Infrastructure | GCP hosting | $5K-20K/month |
| Personnel | Engineering, Safety, BD | $2-5M/year |
| Compliance | Legal, audit | $500K/year |

### 14.3 Unit Economics

```
Subscription Example:
- Price: $5/month
- Split: 40% platform, 40% studio, 20% MASH AI
- MASH AI revenue: $1/month/subscriber
- Inference cost: ~$0.07-0.70/user (100 msgs @ 70K tokens)
- Gross margin: 30-93% depending on usage
```

---

## 15. Success Metrics

### 15.1 Product Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Canon Compliance Rate | >95% | Eval pass rate |
| Refusal Accuracy | >99% | Safety test pass rate |
| Latency (real-time eval) | <500ms | P95 latency |
| API Uptime | 99.9% | Availability |

### 15.2 Business Metrics

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Characters Certified | 10 | 50 | 200 |
| Monthly Active Users | 100K | 1M | 5M |
| API Calls/Month | 10M | 100M | 500M |
| Revenue | $5-10M | $50-100M | $200M+ |

### 15.3 Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| False Positive Rate | <1% | Legitimate responses blocked |
| False Negative Rate | <5% | Violations not caught |
| Developer NPS | >50 | Survey |
| Studio Satisfaction | >90% | Quarterly reviews |

---

## 16. Roadmap

### Phase 0: Foundation (Current)
- [ ] PRD completion
- [ ] Technical architecture design
- [ ] Prototype development

### Phase 1: MVP (Month 1-2)
- [ ] Character Card CRUD
- [ ] Basic evaluation framework (canon, safety)
- [ ] Single LLM adapter (OpenAI)
- [ ] Admin dashboard

### Phase 2: Pilot (Month 3-4)
- [ ] Voice consistency evaluation
- [ ] Multiple LLM adapters
- [ ] Test suite management
- [ ] Real-time guardrails API
- [ ] Pilot with 1 franchise

### Phase 3: Scale (Month 5-8)
- [ ] CanonSafe certification system
- [ ] C2PA provenance integration
- [ ] Python SDK
- [ ] Platform integrations (Discord, GPT Store)
- [ ] Expand to 5+ franchises

### Phase 4: Enterprise (Month 9-12)
- [ ] Multi-tenant enterprise features
- [ ] Advanced analytics
- [ ] Compliance reporting
- [ ] Additional SDKs
- [ ] Self-service onboarding

---

## 17. Appendices

### Appendix A: Competitive Research
<!-- PLACEHOLDER: Will be filled with research agent outputs -->

### Appendix B: Technical Specifications
<!-- PLACEHOLDER: Detailed API specs, data schemas -->

### Appendix C: Regulatory Reference
<!-- PLACEHOLDER: SAG-AFTRA agreement summary, EU AI Act requirements -->

### Appendix D: Sample Character Cards
<!-- PLACEHOLDER: Example Character Card for public domain character -->

---

*Document Version: 1.0*
*Last Updated: 2026-01-01*
*Status: Draft - Awaiting Research Integration*
