# C2PA and Content Provenance Technologies: Research Report

*Research Date: 2026-01-01*

---

## Executive Summary

C2PA (Coalition for Content Provenance and Authenticity) is the emerging standard for AI content provenance. Key findings:

- **200+ organizations** have joined, including Adobe, Microsoft, Google, OpenAI, Meta
- **C2PA 2.2** released May 2025; fast-tracked as ISO standard
- **EU AI Act** (effective August 2026) will require AI content labeling
- **46 US states** have enacted AI-generated media legislation
- Recommended approach: **C2PA metadata + invisible watermarking** for resilience

---

## 1. C2PA Standard Overview

### What It Is

The Coalition for Content Provenance and Authenticity is an open technical standard launched in February 2021, formed through an alliance between Adobe, Arm, Intel, Microsoft, and Truepic.

### Technical Architecture

**Three Core Components:**

1. **Assertions** - Data structures representing statements about the asset
   - 20 standard assertions defined in spec
   - Required: Actions assertion, Hard binding assertion
   - Custom assertions supported for domain-specific needs

2. **Claim** - Digitally signed structure referencing all assertions
   - Connects assertions to the signer
   - Includes content binding information

3. **Claim Signature** - Tamper-evident binding using COSE format
   - Supported algorithms: RSA-PSS, ECDSA P-256/384/512, Ed25519

### Metadata That Can Be Embedded

- **Origin information**: How content was created (camera, AI generation)
- **Tool/device identification**: Which software or hardware was used
- **Edit history**: Actions performed (crop, filter, composite)
- **Timestamps**: When operations occurred
- **Ingredients**: References to source assets with their own provenance
- **AI/ML metadata**: Model information, prompts, training data rights
- **Training permissions**: Whether AI training is allowed

---

## 2. Major Adopters

### AI Companies

| Company | Implementation |
|---------|----------------|
| **OpenAI** | DALL-E 3 in ChatGPT includes C2PA; Sora planned |
| **Google** | Integrating into Search "About this image" and ads |
| **Microsoft** | Integration across products; Chairman of C2PA |
| **Meta** | AI content labels on Instagram/Facebook powered by C2PA |
| **Adobe** | Full integration in Creative Cloud, Firefly |

### Camera Manufacturers

- **Leica M11-P**: First camera with Content Credentials
- **Nikon Z6 III**: Firmware update planned for 2025
- **Sony**: Professional cameras support C2PA
- **Qualcomm Snapdragon 8 Gen3**: Chip-level support
- **Google Pixel 10**: Ships with C2PA support

### Media Organizations

- BBC (founding member)
- The New York Times
- Associated Press
- Reuters
- AFP
- France Televisions (first broadcaster with daily adoption)

---

## 3. Available SDKs

### Official CAI Open Source SDK

**c2pa-python:**
```python
from c2pa import Builder, SigningAlg
from c2pa.sign import sign_ps256

# Create manifest
builder = Builder({
    "claim_generator": "MASH AI v1.0",
    "format": "image/jpeg",
    "assertions": [
        {
            "label": "c2pa.actions",
            "data": {
                "actions": [
                    {"action": "c2pa.created", "softwareAgent": "MASH AI Character Engine"}
                ]
            }
        },
        {
            "label": "c2pa.ai.generative",
            "data": {
                "type": "c2pa.ai_generated",
                "model": "gpt-4-vision"
            }
        }
    ]
})

# Sign and embed
signed_bytes = builder.sign_file(
    input_path="input.jpg",
    output_path="output.jpg",
    signer=sign_ps256,
    cert_chain=cert_bytes,
    private_key=key_bytes
)
```

**c2pa-js / @contentauth/c2pa-web:**
- WebAssembly wrapper for browser use
- Latest version: 0.30.17

**Command-line tool:**
- Read, sign, and verify Content Credentials

---

## 4. Alternatives to C2PA

### SynthID (Google DeepMind)

Invisible watermarks embedded in AI-generated content:

| Media Type | How It Works |
|------------|--------------|
| Images | Neural networks modify pixels imperceptibly |
| Text | Adjusts probability scores during generation |
| Video | Watermark in every frame |
| Audio | Embedded in generated audio |

**Status (2025):**
- 10B+ pieces of content watermarked
- SynthID Text open-sourced
- SynthID Detector portal launched

### Comparison: C2PA vs. Watermarking

| Aspect | C2PA | Watermarking |
|--------|------|--------------|
| Approach | Cryptographic metadata | Signal in content |
| Stripping | Vulnerable to removal | More resistant |
| Screenshots | Destroyed | May survive |
| Trust model | Verifies source identity | Proves AI generation |

**Recommendation:** Use both together for resilience.

---

## 5. Regulatory Requirements

### EU AI Act (Article 50)

**Effective August 2026:**
- AI-generated content must be marked in machine-readable format
- Must be detectable as artificially generated
- Deepfakes require disclosure
- Penalties: Up to 3% of global revenue

**Code of Practice (Draft Dec 2025):**
- Common taxonomy: "fully AI-generated" vs "AI-assisted"
- Standardized icon required for deepfakes
- Multilayered approach: metadata + watermarking + fingerprinting

### US Federal

**TAKE IT DOWN Act (Signed May 2025):**
- First US law regulating AI-generated content
- Criminalizes non-consensual intimate imagery including deepfakes
- Platforms must remove within 48 hours

### US State Laws

- **46 states** have enacted AI media legislation
- **48 states** have deepfake legislation
- **28 states** address political deepfakes specifically
- **301 deepfake bills** introduced in 2025

**Key States:**
- California: Political ad disclaimers, platform removal requirements
- Tennessee (ELVIS Act): Civil remedies for unauthorized voice/likeness
- Utah: AI consumer protection law
- New York: Political content labeling

---

## 6. Implementation Recommendations for MASH AI

### Priority 1: C2PA Content Credentials

```python
# Example assertion structure for AI character content
assertions = [
    {
        "label": "c2pa.actions",
        "data": {
            "actions": [
                {
                    "action": "c2pa.created",
                    "softwareAgent": "MASH AI Character Engine v1.0",
                    "parameters": {
                        "character_card_id": "uuid",
                        "character_name": "Woody"
                    }
                }
            ]
        }
    },
    {
        "label": "c2pa.ai.generative",
        "data": {
            "type": "c2pa.ai_generated",
            "model": "gpt-4",
            "prompt": "[System prompt hash]"
        }
    },
    {
        "label": "mash.character",  # Custom assertion
        "data": {
            "character_card_version": 3,
            "certification_id": "uuid",
            "evaluation_score": 94
        }
    }
]
```

### Priority 2: Direct Disclosure

- Add visible "AI-generated" labels on all content
- Use consistent visual language
- Prepare for EU standardized icon

### Priority 3: Certificate Infrastructure

- Obtain signing certificate from C2PA-recognized CA
- Join C2PA Conformance Program
- Implement secure key management (AWS KMS)

### Implementation Timeline

| Priority | Action | Timeline |
|----------|--------|----------|
| Critical | C2PA for AI-generated images | Q1 |
| Critical | Direct disclosure labels | Q1 |
| High | C2PA for audio/video | Q2 |
| High | Verification UI | Q2 |
| Medium | Invisible watermarking | Q2-Q3 |

---

## Sources

- [C2PA Official Site](https://c2pa.org/)
- [C2PA Specification 2.2](https://spec.c2pa.org/)
- [Content Authenticity Initiative](https://contentauthenticity.org/)
- [CAI Open Source SDK](https://opensource.contentauthenticity.org/)
- [Google SynthID](https://deepmind.google/models/synthid/)
- [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/)
- [US AI Law Tracker](https://ai-law-center.orrick.com/us-ai-law-tracker-see-all-states/)

---

*Research compiled 2026-01-01*
