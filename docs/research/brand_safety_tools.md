# AI Content Moderation & Brand Safety Tools: 2025 Landscape Research

*Research Date: 2026-01-01*

---

## Executive Summary

This research covers the landscape of AI content moderation and brand safety tools relevant to building a character AI platform. Key findings:

- **Hive Moderation** is the industry leader for media/entertainment with clients including Disney, NBCUniversal, and Reddit
- **OpenAI Moderation API** is free and fast (47ms) - excellent baseline layer
- **Azure Content Safety** offers the best custom category support for brand-specific rules
- **Anthropic Constitutional AI** leads in jailbreak resistance (95% blocking rate)
- For character AI, a **layered approach** combining multiple tools is recommended

---

## 1. Hive Moderation

**Core Capabilities:** Text, Image, Video, Audio (multimodal)

### Content Detection Types
- Visual: NSFW, violence, drugs, hate symbols, tobacco, guns, demographics
- Text: Sexual content, violence, bullying, hate speech, spam
- Audio: Speech-to-text with harmful content detection
- Additional: Deepfake detection, CSAM detection (via Thorn integration), copyright detection

### Custom Classifiers
Yes - library of 25+ ready-to-use classifiers with adjustable thresholds

### Processing
Both synchronous (real-time, under 200ms response) and asynchronous (batch) workflows

### API Integration
REST API with easy integration into backend systems, mobile apps, and content management platforms. Includes a moderation dashboard for human review escalations.

### Pricing
Usage-based pricing via API. Video tasks billed at special video rates based on sampling frequency. Contact sales for specific rates.

### Notable Customers in Media/Entertainment
- NBCUniversal
- Vevo
- **Disney**
- Reddit
- BeReal
- Giphy
- Zynga
- Truth Social
- U.S. Department of Defense

---

## 2. Spectrum Labs (Now part of ActiveFence)

**Core Capabilities:** Text (primary focus), with user-level behavior analysis

### Content Detection Types
- 40+ toxic behaviors across languages
- Hate speech, violent extremism, CSAM
- Harassment, bullying, grooming
- Fraudulent activity
- Pro-social/healthy behavior detection (unique capability)

### Custom Classifiers
Yes - Contextual AI that parses user profiles, conversation history, and platform metadata

### Processing
Real-time moderation with user-level analysis (60% of toxic content from 3% of users)

### API Integration
Cloud-based platform (Guardian) designed for gaming and social platforms

### Pricing
Enterprise pricing - contact sales

### Notable Customers
- **Riot Games** (3.3 million time-based penalties in 2021)
- Wildlife Studios
- IMVU (Together Labs)

### Gaming Industry Focus
Guardian for Games allows developers to build safety into products at the design phase. Supports 100+ languages.

---

## 3. Amazon Rekognition

**Core Capabilities:** Image, Video (stored and streaming)

### Content Detection Types
- Three-level hierarchical taxonomy for inappropriate content
- Violence, hate, sexual content, drugs
- Animated/illustrated content type detection
- Custom moderation via adapters

### Custom Classifiers
Yes - Custom Moderation feature using adapters to extend base model capabilities. Also Custom Labels for entirely new detection categories.

### Processing
- Synchronous: DetectModerationLabels API for images
- Asynchronous: StartContentModeration/GetContentModeration for videos
- Batch: StartMediaAnalysisJob for bulk processing
- Maximum video: 10GB, 6 hours duration

### API Integration
AWS SDK with SNS notifications for async jobs. Integration with Amazon A2I for human review workflows.

### Pricing
- Free tier: 60 minutes video analysis/month for 12 months
- Video moderation: $0.10/minute
- Custom Labels: 2 free training hours/month, 1 free inference hour/month
- Pay-per-use with no minimum fees

---

## 4. Google Cloud Vision/Video Intelligence

**Core Capabilities:** Image (Vision API), Video (Video Intelligence API)

### Content Detection Types
- SafeSearch Detection: adult, spoof, medical, violence, racy
- Object and scene recognition
- Explicit content detection in video
- OCR for text-in-image moderation

### Custom Classifiers
Limited with traditional APIs. However, **Gemini for Content Moderation** (latest) supports custom moderation policies and can detect subtle forms of toxicity including sarcasm and hate speech disguised as humor.

### Processing
- Real-time for images
- Batch/streaming for video
- Gemini provides real-time multimodal understanding

### API Integration
REST API with client libraries. Cloudinary add-on available.

### Pricing
- Free tier: First 1,000 units/month
- $1.50 per 1,000 units for Label Detection (1,001-5,000,000 units)
- Per-feature billing (each feature applied is a separate charge)

### Limitations
SafeSearch not reliable as standalone solution - can misclassify benign content

---

## 5. Microsoft Azure Content Safety

**Core Capabilities:** Text, Image, Multimodal (images with text + OCR)

### Content Detection Types
- Violence, hate, sexual, self-harm (with severity scores)
- Prompt injection attacks (jailbreaks)
- Groundedness detection (hallucination correction)
- Protected material/copyright detection
- **Custom categories**

### Custom Classifiers
Yes - Custom Categories API allows training filters on specific content types
- Standard: ML-based training (5-10 hours), English only
- Rapid: Faster, more flexible implementation

### Processing
Real-time with severity scoring

### API Integration
REST API through Azure AI Services. Content Safety Studio for testing.

### Pricing
- F0 tier: Free for testing (transaction limited)
- S0 tier: Production use
- Text: Billed per 1,000-character record
- Image: Billed per image submitted
- Different rates per model type

### Notable Customers
Xbox, Minecraft, MSN (via Two Hat/Community Sift integration)

### Languages
English, Spanish, German, French, Japanese, Portuguese, Italian, Chinese (custom categories English only)

---

## 6. Anthropic Constitutional AI

**Core Capabilities:** Text (integrated into Claude models)

### Approach
- AI system evaluates outputs against a "constitution" of principles
- Constitution draws from UN Declaration of Human Rights, trust and safety best practices, DeepMind Sparrow Principles, and non-western perspectives
- Makes AI values explicit and adjustable

### 2025 Development - Constitutional Classifiers
- Input classifier screens prompts before processing
- Output classifier evaluates responses in real-time
- **95% jailbreak blocking rate** (vs 14% in unguarded models)
- 3,000+ hours of red-team testing with 405 participants
- No universal jailbreak discovered

### Custom Classifiers
Constitution can be updated for specific needs; lighter models (Claude Haiku) recommended for pre-screening

### Processing
Real-time, integrated into model inference

### API Integration
Via Claude API; safety is built into the model itself rather than a separate moderation layer

### Pricing
Included in Claude API pricing

### Market Position
32% of enterprise LLM market share, 42% in coding applications (2025)

---

## 7. OpenAI Moderation API

**Core Capabilities:** Text, Image (multimodal with omni-moderation model)

### Content Detection Types (13 categories)
- Hate / Hate threatening
- Harassment
- Violence / Violence graphic
- Self-harm / Self-harm intent / Self-harm instruction
- Sexual (not sexual/minors)
- Illicit (new) - instructions for wrongdoing
- Illicit/violent (new) - wrongdoing with violence

### Custom Classifiers
No - predefined categories only. However, threshold adjustment is possible for each category. For custom categories, use completions endpoint as workaround.

### Processing
Real-time (**47ms average latency** - 2.3x faster than Perspective API)

### API Integration
Simple REST API endpoint

### Pricing
**FREE** for all OpenAI API users (does not count toward usage limits)

### Languages
40 languages supported (vs 20 in previous model)

### Accuracy
95% overall accuracy (vs 92% for Perspective API in benchmarks)

---

## 8. Perspective API (Jigsaw/Google)

**Core Capabilities:** Text only

### Content Detection Types
- TOXICITY (primary)
- SEVERE_TOXICITY
- INSULT
- THREAT
- OBSCENE
- ATTACK_ON_COMMENTER
- SPAM (experimental)

### Custom Classifiers
No - fixed attributes only

### Processing
Real-time (~100ms response time)

### API Integration
REST API, requires application for API key via Google Form

### Pricing
**FREE** (default 1 QPS quota, future QPS increases may incur fees)

### Languages
18 languages supported. Production attributes (TOXICITY, SEVERE_TOXICITY) fully supported in: English, Spanish, French, German, Portuguese, Italian, Russian

### Scale
Processing 500 million requests daily

### Notable Customers
- The New York Times (Moderator tool)
- FACEIT (gaming platform)

### Limitations
Trained primarily on NYT data, may not work well for all use cases

---

## 9. CleanSpeak

**Core Capabilities:** Text, Image, Video (audio management but not filtering)

### Content Detection Types
- Profanity filtering (multiple languages)
- Bullying detection
- Hate speech
- Custom denylists
- Handles subversions: l33T speak, emojis, Unicode, slang, misspellings

### Custom Classifiers
Yes - fully customizable moderation rules, filter rules, and denylists

### Processing
- Real-time: 10,000+ messages/second on single server
- Queue-based for human review escalation

### API Integration
Self-hosted or cloud-based deployment options

### Pricing
Contact sales (no public pricing)

### Compliance
COPPA, EU privacy standards

### Features
- Multi-application support with different rules per application
- User scoring and automatic action based on behavior
- Built-in reporting and analytics
- Moderator isolation per application

---

## 10. Two Hat / Community Sift (Microsoft)

**Core Capabilities:** Text, Image, Video, Usernames

### Content Detection Types
- Toxicity
- Harassment
- Hate speech
- Child safety concerns
- Community guideline violations
- Handles subversions: acronyms, l33T speak, emojis, Unicode, slang, misspellings

### Custom Classifiers
Yes - extensive customization for moderation rules, filters, and prompts including cultural/language nuances

### Processing
Real-time (36 million evaluations on Xbox player reports annually, 30+ billion interactions monthly)

### API Integration
Integrated into Xbox ecosystem, available for game developers

### Pricing
Enterprise pricing through Microsoft

### Notable Customers
- Xbox
- Minecraft
- MSN

### Note
Acquired by Microsoft in October 2021. Technology now powers safety systems on Xbox and is being integrated with Azure AI Content Safety.

---

## Key Features for Character AI Brand Safety

### Essential Features

| Feature | Why It Matters | Best Tools |
|---------|----------------|------------|
| **Real-time Processing** | Character interactions require sub-200ms latency | OpenAI (47ms), Hive (<200ms) |
| **Multimodal Support** | Text is primary, but image/audio capabilities matter | Hive, Azure, Amazon |
| **Custom Categories/Rubrics** | Brand-specific content policies beyond standard toxicity | Azure, Hive, CleanSpeak |
| **Context Awareness** | Understanding conversation history and user intent | Spectrum Labs, Gemini |
| **Input AND Output Filtering** | Both user prompts and AI responses need moderation | Anthropic Constitutional |
| **Jailbreak Resistance** | Preventing users from bypassing safety measures | Anthropic (95% blocking) |
| **Severity Scoring** | Granular confidence levels rather than binary decisions | Amazon, Azure, OpenAI |
| **Human Escalation Workflows** | Integration with human review for edge cases | Hive, CleanSpeak, Amazon A2I |

### Regulatory Considerations (2025)

The FTC's September 2025 inquiry into AI companion chatbots signals increased scrutiny on:
- Age verification and parental controls
- Character development and approval processes
- Sexually themed content management
- Complaint handling
- Monitoring for negative impacts

---

## Recommended Approach for MASH AI

For character AI brand safety, implement a **layered approach**:

### Layer 1: Free Baseline
**OpenAI Moderation API**
- Free, fast (47ms), good baseline
- Use for general harm detection on all inputs/outputs

### Layer 2: Custom Brand Rules
**Azure Content Safety** or **Hive Moderation**
- Custom categories for brand-specific policies
- Character-specific prohibited topics
- Content rating enforcement

### Layer 3: Constitutional Principles
**Anthropic Constitutional AI approach**
- Build character's "constitution" into system prompts
- Define explicit values and boundaries
- 95% jailbreak resistance

### Layer 4: Human Review
**Escalation workflows**
- Queue flagged interactions for human review
- Build moderator dashboard
- Track patterns and update rules

### Cost Estimate (per 1M interactions)

| Layer | Tool | Cost |
|-------|------|------|
| Layer 1 | OpenAI Moderation | $0 (free) |
| Layer 2 | Azure Custom | ~$500-1,000 |
| Layer 3 | Constitutional | Included in LLM cost |
| Layer 4 | Human Review | Variable (10-20% escalation rate) |

**Total: ~$500-1,500 per 1M interactions** (excluding LLM inference costs)

---

## Comparison Table

| Tool | Text | Image | Video | Audio | Custom | Real-time | Pricing | Best For |
|------|------|-------|-------|-------|--------|-----------|---------|----------|
| Hive | Yes | Yes | Yes | Yes | Yes | <200ms | Usage-based | Enterprise media |
| Spectrum Labs | Yes | No | No | No | Yes | Real-time | Enterprise | Gaming |
| Amazon Rekognition | No | Yes | Yes | No | Yes | Sync/Async | $0.10/min video | AWS customers |
| Google Vision | No | Yes | Yes | No | Limited | Real-time | $1.50/1K | GCP customers |
| Azure Content Safety | Yes | Yes | No | No | Yes | Real-time | Per-record | Microsoft stack |
| Anthropic Constitutional | Yes | No | No | No | Yes | Real-time | Included | Claude users |
| OpenAI Moderation | Yes | Yes | No | No | No | 47ms | **Free** | Everyone (baseline) |
| Perspective API | Yes | No | No | No | No | 100ms | **Free** | Publishing |
| CleanSpeak | Yes | Yes | Yes | Mgmt | Yes | 10K/sec | Enterprise | Gaming/social |
| Two Hat/Microsoft | Yes | Yes | Yes | No | Yes | Real-time | Enterprise | Xbox ecosystem |

---

*Research compiled from web searches conducted 2026-01-01*
