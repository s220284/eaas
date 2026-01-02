# Platform Distribution Strategies for AI Character Experiences

*Research Date: 2026-01-01*

---

## Executive Summary

This research analyzes distribution platforms for AI character experiences. Key findings:

| Platform | Best For | Revenue Share | Content Restrictions |
|----------|----------|---------------|---------------------|
| Discord | Community bots | 90% to creators | Moderate |
| Roblox | Gaming NPCs | 70% DevEx | Strict (child safety) |
| Telegram | Monetized bots | 50% ads | Flexible |
| OpenAI GPT Store | B2B assistants | Limited | No romantic/explicit |
| Claude API | Enterprise | Pay-per-token | Standard AI safety |

**Recommendation:** Build platform-agnostic API layer, prioritize Discord + Roblox for consumer distribution, Claude/OpenAI for enterprise.

---

## 1. OpenAI GPT Store

### Revenue Model
- Engagement-based payments (limited program, US builders only)
- Most creators monetize independently: $500-$10,000+/month through access codes, subscriptions
- No clear revenue share percentage announced

### Content Restrictions
- **Prohibited:** Romantic companions, explicit content, regulated advice
- **Technical limits:** 8,000 character instructions, content filters tightened Oct 2025
- **Roleplay issues:** Models may violate established rules

### Target Audience
- 300M+ weekly active users
- Tech-savvy consumers and businesses

### MASH AI Fit
**Moderate** - Enterprise distribution via API preferred over GPT Store due to content restrictions on character roleplay.

---

## 2. Anthropic Claude

### API Pricing
| Model | Input/Output per 1M tokens |
|-------|---------------------------|
| Claude Opus 4.5 | $5 / $25 |
| Claude Sonnet | $3 / $15 |
| Batch API | 50% discount |

### Distribution Options
- **Claude API:** Direct integration
- **Claude Enterprise:** $100-$1,000/seat
- **Agent Skills Marketplace:** Org-wide skill management (Dec 2025)
- **Cloud providers:** AWS Bedrock, Google Vertex AI

### Strengths
- Extended context (up to 1M tokens)
- Strong instruction-following for character personas
- Privacy: inputs/outputs never used for training

### MASH AI Fit
**High** - Excellent for enterprise character deployments, strong persona consistency.

---

## 3. Roblox

### AI Capabilities
- **Roblox Cube:** Generative AI for 3D/4D content
- **Text Generation API:** LLM-powered NPC dialogue
- **Roblox Guard 1.0:** Required safety classification for all AI

### Revenue Model
- **DevEx rate:** 70% for games $49.99+
- **$1B+ paid** to creators (March 2024-2025)
- **Top 1000 developers:** Average ~$1M revenue

### Safety Requirements
- Dual-level safety classification (prompts + responses)
- Guard 1.0 outperforms Llama Guard, GPT-4o
- **2026 requirement:** Age verification for chat

### Target Audience
- 88.9M daily active users
- Ages 13-24 primary

### MASH AI Fit
**High** - Massive audience, strong AI tooling, but requires strict child safety compliance matching MASH AI's value prop.

---

## 4. Discord

### Bot Ecosystem
- 12M+ active bots
- 28% of all server messages are bot traffic
- 30M users interact with AI integrations

### Monetization
- **Server Subscriptions:** 90% to creators
- **Premium bot features:** Developer-managed tiers
- **Bits integration:** Native tipping

### Content Policies
- Standard community guidelines
- **2025 enforcement:** Shapes.inc + 100K bots banned for child safety violations

### MASH AI Fit
**High** - Best revenue share (90%), high engagement, good for licensed character communities.

---

## 5. Roblox vs UEFN (Fortnite)

| Aspect | Roblox | UEFN/Fortnite |
|--------|--------|---------------|
| Users | 88.9M DAU | 100M+ monthly |
| Revenue share | 70% | 40% of net revenue |
| AI tools | Text Generation API, Guard | Persona Device (coming 2025) |
| Development | Roblox Studio | Unreal Editor |
| Audience | Younger (13-24) | Broader age range |

---

## 6. Streaming (Twitch/YouTube)

### AI VTuber Support
- Virtual avatar streaming supported on both
- AI VTubers achieving top subscriber counts (Neuro-sama)
- Must combine AI with human creative input

### Revenue
| Platform | Creator Share |
|----------|--------------|
| Twitch | ~50% subscriptions + bits + ads |
| YouTube | 55% ad revenue |

### Content Requirements
- YouTube: AI must add originality (not 100% automated)
- Twitch: VTuber dress code, no hateful conduct

### MASH AI Fit
**Moderate** - Requires human streamer involvement, better for branded character streams than pure AI.

---

## 7. VR/AR Platforms

### Meta Quest / Horizon Worlds
- **$50M creator fund** (2025)
- **AI tools:** Natural language world generation
- **Revenue:** ~52.5% after Meta's 47.5% fees

### Apple Vision Pro
- App Store model (70/30 split)
- On-device AI processing (M5 chip)
- Enterprise focus

### MASH AI Fit
**Future opportunity** - VR character experiences emerging, but market still early.

---

## 8. Messaging Platforms

### WhatsApp Business API
- 2B+ users
- $0.008-0.063 per message
- **Limitation:** Customer service only, no entertainment characters

### Telegram
- 500M+ Mini App users
- 50% ad revenue share
- Flexible content policies
- Best for: Monetized community bots

### Instagram DMs
- Brand engagement focus
- Must use official API
- Can only message users who initiated contact

### MASH AI Fit
- **Telegram:** High potential for monetized character bots
- **WhatsApp/Instagram:** Limited to business use cases

---

## Platform Selection Matrix

| Use Case | Primary Platform | Secondary | Avoid |
|----------|-----------------|-----------|-------|
| Entertainment roleplay | Discord | Telegram | WhatsApp, GPT Store |
| Gaming NPCs | Roblox | UEFN | - |
| Enterprise | Claude API | OpenAI Enterprise | Consumer platforms |
| Live streaming | YouTube | Twitch | - |
| VR experiences | Meta Quest | Vision Pro | - |
| Brand engagement | Instagram | Telegram | - |

---

## Technical Requirements Summary

### API/SDK Distribution (Primary)
- REST API with authentication
- Python SDK
- JavaScript/TypeScript SDK
- Rate limiting and usage metering

### Platform-Specific
- Discord: Discord.js, OAuth2, webhooks
- Roblox: Roblox Studio, Verse scripting, Guard compliance
- Unity/Unreal: Native plugins
- Telegram: Bot API, Bot Token

---

## Revenue Opportunity Analysis

### Best Revenue Share
1. **Discord:** 90% for subscriptions
2. **Telegram:** 50% ads + Stars + subscriptions
3. **Roblox:** 70% DevEx for premium games
4. **YouTube:** 55% ad revenue
5. **UEFN:** 40% net revenue

### Largest Addressable Audience
1. **YouTube:** 2.5B+ MAU
2. **WhatsApp:** 2B+ users (limited use)
3. **Instagram:** 2B+ MAU (limited use)
4. **Telegram:** 500M+ Mini App users
5. **OpenAI:** 300M+ weekly users
6. **Discord:** 200M MAU
7. **Roblox:** 88.9M DAU

---

*Research compiled 2026-01-01*
