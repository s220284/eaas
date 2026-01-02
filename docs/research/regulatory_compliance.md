# Union Agreements and Regulatory Requirements for AI Character Platforms

*Research Date: 2026-01-01*

---

## Executive Summary

Compliance requirements for AI character platforms working with major studios span:
- **SAG-AFTRA agreements** (consent, compensation, strike clauses)
- **EU AI Act** (transparency, labeling - effective August 2026)
- **NO FAKES Act** (pending federal legislation)
- **46 state laws** regulating AI-generated media

This creates a **regulatory moat** for compliant platforms - studios cannot risk working with non-compliant providers.

---

## 1. SAG-AFTRA Requirements

### 2025 Interactive Media Agreement (Video Games)

**Consent Requirements:**
- Clear and conspicuous consent for digital replicas
- "Reasonably specific description" of intended use
- Separately signed/initialed (cannot be buried in terms)
- Per-project consent required
- Consent invalidated if actual use deviates from description

**Compensation:**
- 4-hour session fee per 300 lines / 3,000 words
- Secondary compensation when digital replica is used
- Health and retirement contributions required
- Performers can set own price (above minimums)
- 15.17% wage increase upon ratification + 3% annual through 2027

**Strike Clause (CRITICAL):**
- Performers can suspend consent during strikes
- Unique to 2025 IMA
- System must track and enforce suspension

**Union Jurisdiction Triggers:**
- Interactive programs with real-time user manipulation
- Budget tiers: $250K to under $30M (Tiered-Budget IMA)
- SAG-AFTRA "Global Rule One" applies

### 2023 TV/Theatrical Contracts

**Digital Replica Types:**
| Type | Definition |
|------|------------|
| Employment-Based | Created during performer's employment |
| Independently Created | Using preexisting materials without participation |
| Synthetic Performers | AI-generated, not recognizable as specific person |

**Requirements:**
- Consent for creation AND initial use
- 48-hour notice generally required
- Separate consent for additional projects
- If synthetic performer has recognizable features of real actor, consent required

---

## 2. NO FAKES Act (Pending Federal Legislation)

### Current Status
- Introduced April 2025 (House H.R.2794, Senate)
- Bipartisan: Coons, Blackburn, Klobuchar, Tillis
- **Not yet enacted**

### Key Provisions

**Digital Replication Right:**
- Federal right to control AI versions of voice/likeness
- Extends 70 years after death (if renewed every 10 years)
- Transferable to heirs

**Liability:**
- Private right of action with statutory damages
- Liability for distributing tools "primarily designed" for replicas
- DMCA-style notice-and-takedown for platforms

**Exceptions:**
- News, documentaries, historical works
- Commentary, scholarship
- Satire or parody
- Biographical works

**Preemption:**
- Preempts state digital replica laws (with exceptions)
- Collective bargaining agreements may provide greater protection

### Supporters
SAG-AFTRA, RIAA, MPA, OpenAI, IBM, Disney, Warner Music, Universal Music, Sony Music, YouTube, Authors Guild, WME, CAA

---

## 3. EU AI Act

### Timeline
| Date | Requirement |
|------|-------------|
| August 2, 2025 | GPAI model obligations effective |
| August 2, 2026 | Transparency obligations (Article 50) |
| August 2, 2027 | Full enforcement |

### Article 50: Transparency Requirements

**For AI Content Providers:**
- Outputs must be marked in machine-readable format
- Must be detectable as AI-generated
- Solutions must be effective, interoperable, robust

**For Deployers:**
- Must disclose deepfakes as artificial
- Must disclose AI-generated text on public interest matters
- Must inform users when interacting with AI

**Penalties:**
- Up to EUR 15 million or 3% global turnover

### Classification
Entertainment AI is **NOT high-risk** - falls under limited risk (transparency requirements only)

### GPAI Code of Practice
- 26 signatories including: Amazon, Anthropic, Google, Microsoft, OpenAI
- Notable absence: Meta
- Chapters: Transparency, Copyright, Safety/Security

---

## 4. State Laws (46 states have AI media legislation)

### Tennessee ELVIS Act (July 1, 2024)
- First state to address AI voice cloning
- Covers actual voice AND simulations
- Criminal penalties: Class A misdemeanor (up to 11 months jail)

### California

**AB 2602 (January 1, 2025):**
- Contracts void if:
  - Allow digital replica in place of performer's work
  - Don't provide "reasonably specific" use list
  - Individual not represented (lawyer or union)

**AB 1836 (January 1, 2026):**
- Posthumous rights: Estate permission required
- Fines: $10,000 or actual damages

### New York

**Digital Replica Contracts Act (January 1, 2025):**
- Provisions void if replica replaces performer's work

**AI Synthetic Performers Disclosure (June 9, 2026):**
- Conspicuous disclosure required in advertisements
- Penalties: $1,000 first, $5,000 subsequent

**Posthumous Right (December 11, 2025):**
- Consent from heirs for audiovisual works

### Other Key States
- **Illinois:** Digital Voice and Likeness Protection Act
- **Texas:** Election deepfake disclosure, child exploitation
- **Washington:** Criminalizes deepfakes for harassment

---

## 5. Technical Compliance Requirements

### Consent Management System

**Must Track:**
- Per-project consent with scope description
- Separate signature/initials
- Consent validity (invalidation if use changes)
- Strike suspension status
- Representation verification

### Digital Replica Registry

**Must Record:**
- Employment-Based vs Independently Created classification
- Visual vs Vocal categorization
- Performer identification linking
- Source material tracking
- Creation circumstances

### Usage Tracking

**Must Monitor:**
- Real-time usage
- Deviation from approved descriptions
- Project associations
- Usage reports for performers

### Compensation Engine

**Must Calculate:**
- Session fees (per 300 lines / 3,000 words)
- Secondary compensation on usage
- Health/retirement contributions
- Custom negotiated rates
- Union minimums

### Audit Trail

**Must Maintain:**
- Immutable consent records
- Version-controlled descriptions
- Access logs
- Modification history
- Claims/arbitration records

---

## 6. Content Provenance (C2PA)

### Requirements
- Machine-readable AI labeling (EU AI Act)
- Cryptographic metadata (tamper-evident)
- Industry standard for AI transparency

### Implementation
```python
# Required assertions for compliance
assertions = [
    {
        "label": "c2pa.ai.generative",
        "data": {
            "type": "c2pa.ai_generated",
            "model": "model_name"
        }
    },
    {
        "label": "c2pa.actions",
        "data": {
            "actions": [
                {"action": "c2pa.created", "softwareAgent": "MASH AI"}
            ]
        }
    }
]
```

### Adoption
- Camera manufacturers: Leica, Nikon
- AI providers: DALL-E, ChatGPT
- Platforms: Meta, Google

---

## 7. Compliance Architecture for MASH AI

### Tier 1: Essential (Must Have)

| Requirement | Source | Implementation |
|-------------|--------|----------------|
| Consent mechanism | SAG-AFTRA | Character Card legal pack |
| Specific use description | SAG-AFTRA, CA | Structured consent forms |
| Separate signature | SAG-AFTRA | Digital signature capture |
| Per-project tracking | SAG-AFTRA | Database per-project linking |
| Representation verification | CA AB 2602 | Union/lawyer flag |
| AI labeling | EU AI Act | C2PA integration |
| Usage reports | SAG-AFTRA | Performer dashboard |
| Compensation tracking | SAG-AFTRA | Payment engine |
| Strike suspension | SAG-AFTRA 2025 IMA | Consent state machine |
| Audit trail | Multiple | Immutable logging |

### Tier 2: Studio Requirements

| Requirement | Source |
|-------------|--------|
| SAG-AFTRA signatory status | Union jurisdiction |
| Budget tier compliance | IMA |
| Health/retirement contributions | SAG-AFTRA |
| 48-hour notice | TV/Theatrical |
| Posthumous rights clearance | CA, NY |

### Tier 3: Future-Proofing

| Requirement | Source | Timeline |
|-------------|--------|----------|
| Federal digital replica registration | NO FAKES Act | Pending |
| Notice-and-takedown | NO FAKES Act | Pending |
| EU transparency code | EU AI Act | Aug 2026 |

---

## 8. Database Schema for Compliance

```sql
-- Performer consent records
CREATE TABLE performer_consents (
    id UUID PRIMARY KEY,
    performer_id UUID REFERENCES performers(id),
    character_card_id UUID REFERENCES character_cards(id),

    -- Consent details
    use_description TEXT NOT NULL,
    consent_signature BYTEA NOT NULL,
    signature_timestamp TIMESTAMPTZ NOT NULL,

    -- Representation
    represented_by VARCHAR(100), -- 'union' or 'lawyer' or null
    representative_name VARCHAR(255),

    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, revoked
    strike_suspended BOOLEAN DEFAULT FALSE,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY,
    consent_id UUID REFERENCES performer_consents(id),

    -- Usage details
    project_name VARCHAR(255),
    use_type VARCHAR(100), -- visual, vocal, both
    line_count INTEGER,
    word_count INTEGER,

    -- Compliance
    within_scope BOOLEAN,
    deviation_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compensation tracking
CREATE TABLE compensation_events (
    id UUID PRIMARY KEY,
    consent_id UUID REFERENCES performer_consents(id),
    usage_log_id UUID REFERENCES usage_logs(id),

    -- Compensation
    session_fee DECIMAL(10,2),
    secondary_compensation DECIMAL(10,2),
    health_contribution DECIMAL(10,2),
    retirement_contribution DECIMAL(10,2),

    -- Payment status
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Key Takeaways

1. **SAG-AFTRA compliance is non-negotiable** for major studio work - consent, compensation, and strike clauses must be systematically tracked

2. **EU AI Act creates August 2026 deadline** for machine-readable AI labeling - C2PA integration should start now

3. **NO FAKES Act will likely pass** - design for 70-year posthumous rights tracking and notice-and-takedown

4. **46 states have varying requirements** - build for strictest (California) to ensure nationwide compliance

5. **Regulatory complexity is MASH AI's moat** - studios will pay premium for guaranteed compliance

---

*Research compiled 2026-01-01*
