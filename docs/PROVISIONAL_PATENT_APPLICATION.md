# PROVISIONAL PATENT APPLICATION

## Filed Under 35 U.S.C. §111(b)

---

**Title of Invention:**
Computer-Implemented System and Method for Multi-Dimensional Evaluation, Certification, and Continuous Governance of AI-Generated Content Across Modalities Produced by Autonomous Agents and Agentic Workflows Using Structured Canonical Intellectual Property Profile Documents and Configurable Adjudication Frameworks

**Inventor(s):** Shelly Palmer
**Residence:** [TO BE COMPLETED — City, State, Country]
**Citizenship:** [TO BE COMPLETED]

**Applicant:** The Palmer Group
**Entity Status:** [CHECK ONE: Micro Entity ($65) / Small Entity ($130) / Large Entity ($325)]

**Correspondence Address:**
[TO BE COMPLETED — Full mailing address for USPTO correspondence]

**Filing Date:** [TO BE COMPLETED — Date of electronic submission]

---

## SPECIFICATION

### TITLE OF THE INVENTION

Computer-Implemented System and Method for Multi-Dimensional Evaluation, Certification, and Continuous Governance of AI-Generated Content Across Modalities Produced by Autonomous Agents and Agentic Workflows Using Structured Canonical Intellectual Property Profile Documents and Configurable Adjudication Frameworks

### CROSS-REFERENCE TO RELATED APPLICATIONS

Not applicable.

### REFERENCES TO PRIOR ART

The following references are cited to distinguish the present invention from the existing art:

**U.S. Patents and Published Applications:**

1. U.S. Patent No. 10,853,717 B2, "Creating a Conversational Chat Bot of a Specific Person," issued December 1, 2020, assigned to Microsoft Technology Licensing LLC. Describes creating chatbots emulating specific individuals by building a "personality index" from social data. This reference addresses personality-based content *generation*, not content *evaluation* against a canonical profile.

2. U.S. Patent No. 12,111,754 B1, "Dynamically Validating AI Applications for Compliance," issued October 8, 2024, assigned to Citibank, N.A. Describes constructing test cases from regulatory guidelines and generating compliance indicators for AI applications. This reference addresses regulatory compliance validation using general regulatory guidelines, not evaluation against structured intellectual property canonical profiles comprising character-specific canon, voice, legal, safety, and modality-specific identity specifications.

3. U.S. Patent No. 11,996,117 B2, "Multi-Stage Adaptive System for Content Moderation," issued May 28, 2024, assigned to Modulate, Inc. Describes a multi-stage content moderation pipeline with contextual threshold adjustment. This reference addresses general content toxicity moderation, not character-specific canonical fidelity, voice consistency, or intellectual property compliance evaluation.

4. U.S. Patent No. 12,073,180 B2, "Computer Implemented Methods for the Automated Analysis or Use of Data, Including Use of a Large Language Model," issued August 27, 2024, assigned to Unlikely Artificial Intelligence Ltd. Describes structured machine-readable representations for validating LLM outputs. This reference addresses general factual accuracy validation, not character-specific canonical profile evaluation across modalities.

5. U.S. Patent No. 11,893,981 B1, "Search System and Method Having Civility Score," issued February 6, 2024, assigned to Seekr Technologies Inc. Describes LLM-based scoring of audio content for brand safety. This reference addresses advertising brand safety using industry-standard categories (GARM framework), not intellectual property owner-defined character-specific canonical profiles.

6. U.S. Patent Application Publication No. 2025/0342835 A1, "Automated Extraction of Brand Voice Attributes for Generation of Content in Brand Voice Through Machine Learning," published November 6, 2025, assigned to Intuit Inc. Describes extracting brand voice attributes from existing content samples for content generation. This reference addresses brand voice attribute extraction for *generation*, not multi-dimensional evaluation of independently-generated content against a structured character profile encompassing canonical facts, legal rights, performer consent, and modality-specific identity.

7. U.S. Patent No. 12,417,413 B2, "Content Moderation," issued September 16, 2025, assigned to Go Bubble Ltd. Describes combining multiple ML model outputs through configurable rules for content moderation. This reference addresses general platform content moderation, not evaluation against character-specific intellectual property profiles.

8. U.S. Patent Application Publication No. 2025/0005060 A1, "Runtime Content Moderation for LLMs," published January 2, 2025, assigned to JPMorgan Chase Bank, N.A. Describes configurable rules and policies applied to LLM inputs and outputs. This reference addresses general content policy enforcement, not intellectual property character-specific evaluation.

**Academic Publications:**

9. Liu et al., "G-Eval: NLG Evaluation Using GPT-4 with Better Human Alignment," Proceedings of the Conference on Empirical Methods in Natural Language Processing (EMNLP), December 2023. Establishes the general methodology of using LLMs with chain-of-thought reasoning and configurable evaluation criteria to score natural language generation outputs. The present invention applies this general methodology within a specialized system architecture specifically designed for character and intellectual property governance across modalities.

10. Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena," Advances in Neural Information Processing Systems (NeurIPS), 2023. Establishes the viability of using strong LLMs as evaluation judges. The present invention extends this paradigm to character-specific multi-dimensional evaluation against structured intellectual property profiles.

11. "LLM-Rubric: A Multidimensional, Calibrated Approach to Automated Evaluation of Natural Language Texts," Proceedings of the Association for Computational Linguistics (ACL), 2024, Microsoft Research. Describes multi-dimensional rubric-based LLM evaluation with calibration. The present invention differs in that evaluation dimensions are dynamically assembled from character-specific intellectual property profile documents rather than static rubrics, and the system integrates performer consent verification, legal compliance, and multi-modal identity evaluation.

12. "CharacterEval: A Chinese Benchmark for Role-Playing Conversational Agent Evaluation," arXiv:2401.01275, January 2024. Describes a benchmark for evaluating character consistency across four dimensions with thirteen metrics. The present invention differs as a configurable production system (not a fixed benchmark) with IP governance, legal compliance, multi-modal evaluation, and continuous improvement capabilities.

13. Bai et al., "Constitutional AI: Harmlessness from AI Feedback," Anthropic, December 2022. Establishes the paradigm of AI systems evaluating outputs against a set of defined principles. The present invention applies principle-based evaluation specifically to character intellectual property governance using structured per-character profiles (not universal safety principles) with multi-dimensional scoring (not binary classification).

14. "CoReflect: Conversational Evaluation via Co-Evolutionary Simulation and Reflective Rubric Refinement," arXiv:2601.12208, January 2025. Describes reflective rubric refinement where evaluation results inform rubric improvements. The present invention applies rubric refinement specifically to character-canonical evaluation criteria informed by intellectual property owner requirements, with human-in-the-loop approval.

**Industry Standards and Frameworks:**

15. C2PA (Coalition for Content Provenance and Authenticity) Content Credentials specification. Defines an open standard for tamper-evident content provenance metadata. The present invention integrates with provenance standards to embed evaluation scores and certification status alongside provenance metadata.

16. EIDR/HAND Digital Replicas and Talent ID Framework, IBC Accelerator 2024. Describes consent-based digital replica tracking using content credentials. The present invention integrates performer consent verification as an evaluation dimension within a broader character fidelity evaluation pipeline.

17. NVIDIA NeMo Guardrails, open-source toolkit, 2023. Provides programmable guardrails for LLM-based systems including topic control and safety rails. The present invention differs in providing character-specific intellectual property evaluation using structured profile documents across modalities, rather than general-purpose safety guardrails.

### FIELD OF THE INVENTION

The present invention relates generally to computer-implemented methods for quality assurance and governance of AI-generated content across all output modalities, and more specifically to methods for evaluating content produced by autonomous AI agents, sub-agents, and orchestrated agentic workflows against canonical fidelity, brand safety, voice consistency, and legal compliance specifications defined by intellectual property owners. The invention further relates to continuous improvement mechanisms whereby evaluation results feed back into both the content-generating agents and the evaluation criteria themselves, creating a self-improving governance loop operating at the scale required by autonomous content production systems.

Critically, the present invention is directed to evaluating independently-generated content against a structured intellectual property profile document that serves as an evaluation reference standard. The profile document is not used as an input to the content generation process. This distinguishes the invention from systems that use structured character profiles to generate content (such as chatbot personality systems or AI character engines), and from general-purpose content moderation systems that evaluate content against universal safety taxonomies rather than character-specific canonical profiles defined by intellectual property owners.

### BACKGROUND OF THE INVENTION

#### The Problem

The rapid proliferation of large language models (LLMs), multi-modal foundation models, and autonomous AI agent systems has created an unprecedented volume of AI-generated content across all modalities — text, images, video, and audio. Intellectual property (IP) owners including film studios, game publishers, toy companies, consumer brands, sports leagues, and media companies face a fundamentally new challenge: governing the fidelity, safety, and legal compliance of content that is produced not by humans, but by autonomous AI systems operating at machine speed and machine scale.

This challenge manifests across multiple dimensions:

1. **Autonomous Agent Content Production**: AI systems have evolved from simple prompt-response chatbots to fully autonomous agents and orchestrated agentic workflows — groups of agents coordinated to accomplish complex goals. A single agentic pipeline may generate thousands of content artifacts per hour: social media posts, marketing assets, customer communications, video highlights, product descriptions, and interactive character experiences. Each artifact must comply with brand standards, character canon, content safety rules, and legal requirements. No human review process can operate at this velocity.

2. **Multi-Modal Content Generation**: Modern foundation models generate not only text but also images, video, and audio. An agentic workflow producing a marketing campaign may simultaneously generate advertising copy (text), product imagery (images), promotional videos (video), and voice-over narration (audio). Each modality presents distinct evaluation challenges — textual canon fidelity differs fundamentally from visual brand consistency, which differs from vocal identity matching.

3. **Canon Drift at Scale**: When thousands of agents across multiple platforms simultaneously generate content portraying the same fictional character, the cumulative effect of small deviations produces severe canon drift. An agent generating social media posts may fabricate character relationships. Another agent creating video content may depict a character's appearance incorrectly. A third agent writing interactive dialogue may contradict established backstory. Without systematic evaluation, these deviations compound and erode IP value.

4. **Voice Inconsistency Across Modalities**: A character's voice — encompassing personality, tone, vocabulary, speech patterns, and mannerisms — must remain consistent whether the output is a text response, a caption on an image, dialogue in a video, or synthesized speech in an audio clip. Current systems have no mechanism to enforce cross-modal voice consistency.

5. **Brand Safety at Autonomous Scale**: Without per-character, per-brand guardrails operating in real time within agentic pipelines, autonomous systems may generate content that is off-brand, age-inappropriate, or damaging to the IP owner's reputation. Generic content moderation tools detect toxicity but cannot enforce character-specific content ratings, prohibited topics, visual style requirements, or required disclosures.

6. **Legal and Regulatory Non-Compliance**: An emerging and complex web of regulations governs AI-generated content featuring real or fictional characters. These include SAG-AFTRA performer consent requirements for digital replicas (established in the December 2023 TV/Theatrical contract and the January 2024 Replica Studios agreement), the EU AI Act's transparency mandates, the pending NO FAKES Act establishing federal digital replica rights, California laws AB 1836 and AB 2602 governing digital replicas, and numerous additional U.S. state laws regulating AI-generated media. Autonomous agents generating content at scale must verify that performer consent is active, that usage falls within consented scope and territories, and that required legal disclosures are present — all without human intervention.

7. **Agent-to-Agent Content Distribution**: In emerging zero-click and agentic commerce environments, AI agents serve content to other AI agents — a recommendation agent presents product descriptions to a purchasing agent, which in turn presents summaries to a consumer-facing agent. Content may traverse multiple agent-to-agent handoffs before reaching a human consumer (if it ever does). Evaluation must operate at every handoff, not merely at the final human-facing boundary.

8. **Franchise-Level Consistency**: IP owners manage not individual characters in isolation but entire franchises comprising dozens or hundreds of characters inhabiting a shared fictional world. AI-generated content must maintain not only individual character fidelity but cross-character consistency — characters must relate to each other correctly, share a consistent world, and collectively maintain the franchise's canonical integrity. No existing system evaluates franchise-level coherence across AI-generated content.

9. **No Existing Standard for Agentic Content Governance**: There is no established industry framework for certifying that content produced by autonomous AI agents meets canonical, brand, and legal standards across all output modalities. IP owners currently rely on ad hoc manual review of samples, which is unscalable, statistically unreliable, and unable to operate at the speed required by agentic content production pipelines.

#### Limitations of Existing Approaches

**Generic LLM Safety Tools** (e.g., OpenAI Moderation API, Anthropic's Constitutional Classifiers): These tools detect toxicity, hate speech, and general content policy violations using universal safety principles (see Reference 13). They have no concept of character-specific canon, brand voice, or IP-specific legal constraints. They operate primarily on text, apply binary allow/block decisions rather than multi-dimensional scoring, and have no integration point for character-specific agentic pipeline middleware.

**Character AI Platforms** (e.g., Character.AI, Inworld AI, Convai): These platforms use structured character profiles — Character.AI uses personality descriptions and example conversations; Inworld AI uses a Character Engine with structured personality dimensions, knowledge bases, and behavioral rules — to *generate* character behavior. However, they are content generation platforms, not content evaluation systems. They provide no mechanism for an IP owner to evaluate independently-generated content against a canonical standard. They lack formal multi-dimensional evaluation frameworks, certification systems, performer consent verification, multi-modal evaluation capabilities, and continuous improvement feedback loops. Inworld's CharacterProfile data structure (see Section B of the Detailed Description for comparison) is used to drive generation, not to score third-party content.

**General LLM Evaluation Platforms** (e.g., Braintrust AI, DeepEval, Promptfoo, LangSmith, Arize Phoenix, Weights & Biases Weave): These platforms provide general-purpose LLM evaluation capabilities including configurable scorers and LLM-as-judge evaluation (see References 9-11). DeepEval implements G-Eval-style criteria-based evaluation; Braintrust provides custom scorer support; Arize Phoenix offers template-based LLM-judge rubrics. However, they all lack: (i) the specific structured data model for character canonical profiles integrating canon, legal, and safety information across modalities; (ii) evaluation dimensions designed for character and brand fidelity assessment including performer consent verification; (iii) the character-versioned evaluation history enabling longitudinal tracking of specific intellectual properties; (iv) any mechanism for integration into agentic pipelines as real-time character-governance middleware; and (v) continuous improvement feedback loops connecting evaluation results to character-specific agent behavior modification.

**Brand Safety Content Scoring Systems** (e.g., Seekr Technologies — see Reference 5 — holding 30+ patents including U.S. Patent No. 11,893,981; Integral Ad Science holding 65+ patents with multi-modal classification models; Zefr holding 8 patents for AI-powered content classification; DoubleVerify): These systems score content against industry-standard brand safety categories (such as the GARM framework) for advertising suitability decisions. While they employ multi-signal scoring with LLM-based evaluation — and Zefr specifically performs multi-modal content classification across video, text, audio, and images — they evaluate against *universal advertising safety taxonomies*, not against *IP owner-defined character-specific canonical profiles*. They have no concept of canon fidelity, voice consistency for a specific fictional character, performer consent verification, or character relationship accuracy. They cannot distinguish whether a portrayal of a specific character is canonically accurate; they can only determine whether content is generally brand-safe for advertising adjacency.

**Enterprise Content Moderation** (e.g., Hive Moderation, Spectrum Labs/ActiveFence, Modulate — see References 3, 7): These solutions are reactive (detecting bad content after generation) rather than proactive (ensuring generated content meets affirmative character-specific quality criteria). Modulate's multi-stage adaptive pipeline (Reference 3) provides contextual threshold adjustment for toxicity detection but has no concept of "canon fidelity" or "voice consistency" for a specific character. These systems cannot evaluate multi-modal brand consistency against a structured character identity specification and do not integrate into autonomous agent pipelines as character-governance middleware.

**AI Compliance Validation Systems** (e.g., the system described in Reference 2, U.S. Patent No. 12,111,754 assigned to Citibank): These systems construct test cases from regulatory guidelines and generate compliance indicators for AI applications. However, they evaluate against *general regulatory guidelines* (financial regulations, corporate policies) rather than structured intellectual property canonical profiles. They do not address character-specific canon fidelity, voice consistency, multi-modal character identity evaluation, performer consent scope verification, or the specific evaluation dimensions required by IP owners governing fictional character portrayals across modalities.

**Agent Orchestration Platforms** (e.g., LangChain, AutoGen, CrewAI) and **Programmable Guardrails Toolkits** (e.g., NVIDIA NeMo Guardrails — see Reference 17 — Guardrails AI, Amazon Bedrock Guardrails): Agent orchestration platforms provide agent coordination capabilities but include no built-in evaluation framework for the content their agents produce. Guardrails toolkits provide programmable safety rails including topic control, PII detection, and jailbreak prevention using configurable policies. However, these guardrails enforce general safety policies (e.g., "do not discuss prohibited topics," "detect prompt injection"), not character-specific canonical fidelity policies (e.g., "this character speaks in simple sentences with a British accent," "this character's favorite activity is jumping in muddy puddles," "this character's performer has consented to voice-only AI use in US and UK territories"). The distinction is between *universal safety enforcement* and *IP-specific canonical evaluation*.

**Content Provenance and Certification Standards** (e.g., C2PA — see Reference 15 — SynthID by Google DeepMind, Digimarc): These standards and systems provide content provenance — cryptographically verifiable records of content origin, creation history, and modification chain. They certify *where content came from*, not *whether content accurately portrays a character*. The present invention complements provenance systems by embedding evaluation scores and character-compliance certification status within provenance metadata.

**Academic Character Evaluation Benchmarks** (e.g., CharacterEval — see Reference 12 — RPEval, RVBench, CharacterBox, RPGBENCH): These research benchmarks evaluate character consistency in LLM role-playing scenarios using fixed multi-dimensional metrics. CharacterEval evaluates across four dimensions with thirteen metrics for 77 Chinese characters. However, these are *fixed benchmarks* (not configurable production systems), evaluate *text-only* output (not multi-modal content), use *static rubrics* (not IP owner-configurable critics), and lack IP governance, legal compliance verification, agentic middleware capabilities, and continuous improvement feedback loops.

#### Need for the Invention

There exists a need for a systematic, automated, model-agnostic system and method for evaluating AI-generated content — across text, image, video, and audio modalities — produced by autonomous agents and agentic workflows, against a structured canonical profile defined by the intellectual property owner that integrates factual canon, voice/personality specifications, visual and audio identity standards, legal rights and performer consent terms, and content safety rules. Such a system must: (a) serve as an *evaluation reference standard* applied to independently-generated content, not as an input to the content generation process; (b) produce multi-dimensional scores enabling IP owners to certify, compare, and continuously monitor the quality of AI-generated content across any LLM or foundation model provider; (c) automatically verify that content falls within the scope of performer consent and territorial licensing before distribution; (d) operate as real-time middleware within agentic pipelines at the scale required by autonomous content production; (e) support configurable and extensible evaluation dimensions through a pluggable critics framework where each critic's evaluation prompt is dynamically assembled from the character's canonical profile; (f) evaluate not only individual character fidelity but franchise-level consistency across multiple characters inhabiting a shared fictional world; and (g) implement a continuous improvement flywheel whereby evaluation results are used to refine both the content-generating agents and the character-specific evaluation criteria themselves.

### SUMMARY OF THE INVENTION

The present invention provides a computer-implemented system and method comprising the following principal capabilities:

**Capability 1 — Structured Multi-Modal Intellectual Property Profile ("Character Card"):** Creating and storing a structured character or brand profile document associated with a specific intellectual property, the profile document serving exclusively as an *evaluation reference standard* for scoring independently-generated content. The profile document is not used as an input to the content generation process. Each profile document comprises at least five component packs:
- A **Canon Pack** containing machine-readable canonical facts with source citations, a voice/personality profile specifying personality traits, tone, speech style, vocabulary level, and catchphrases, and a relationship graph defining the character's relationships to other entities within the franchise;
- A **Legal Pack** containing rights metadata, performer consent records specifying consent type, scope, territorial restrictions, usage limitations, and expiration dates, and required legal notices;
- A **Safety Pack** containing content rating, prohibited topics, required disclosures, and age-gating configuration;
- A **Visual Identity Pack** containing color specifications with precise values and tolerances, visual style guides, character appearance descriptions, logo usage rules, and approved/prohibited visual elements;
- An **Audio Identity Pack** containing voice characteristics (pitch, cadence, accent specifications), approved musical themes, sound effect guidelines, and prohibited audio elements.

Each Character Card is versioned and immutable once published. Modifications create new versions, preserving a complete audit trail. Character Cards are organized within Franchises, enabling franchise-level evaluation and cross-character consistency analysis.

**Capability 2 — Multi-Modal Evaluation Engine:** Evaluating AI-generated content across any combination of output modalities (text, image, video, audio) using a multi-dimensional adjudication system. For each content artifact, the system:
- Identifies the modality or modalities present;
- Dispatches modality-appropriate evaluation prompts to one or more Judge models (which may include vision-language models, audio analysis models, or multi-modal foundation models);
- Dynamically assembles each evaluation prompt from the applicable Character Card's component packs, ensuring that evaluation criteria are character-specific rather than generic;
- Scores the content across configurable evaluation dimensions;
- Computes a weighted aggregate score; and
- Determines pass/fail certification status.

**Capability 3 — Configurable Character-Specific Critics Framework:** An extensible evaluation architecture where each evaluation dimension is implemented as a pluggable "critic" module whose evaluation prompt is dynamically assembled from the applicable Character Card's component packs. Default critics include canon fidelity, voice consistency, brand safety, legal compliance, visual identity, and audio identity. Organizations may add custom critics (e.g., fan sentiment critic, competitive differentiation critic, accessibility critic, cultural sensitivity critic) with configurable weights and thresholds. Each critic defines its own evaluation prompt template with placeholder variables that are populated from the Character Card data at evaluation time, scoring anchor points, critical rules, failure conditions, and applicable modalities. This approach ensures that each evaluation is grounded in the specific character's canonical profile, distinguishing the invention from general-purpose evaluation frameworks that use static rubrics.

**Capability 4 — Performer Consent Scope Verification:** Automatically verifying that AI-generated content falls within the scope of performer consent as defined in the Character Card's Legal Pack. For each content artifact, the system:
- Retrieves the performer consent record from the applicable Character Card version;
- Verifies that the consent has not expired;
- Verifies that the content's intended distribution territory falls within the consented territories;
- Verifies that the content modality falls within the consented scope (e.g., VOICE_ONLY consent does not authorize visual likeness usage; AI_DIGITAL_REPLICA consent authorizes both voice and visual);
- Verifies that the content does not violate usage restrictions specified in the consent (e.g., no political content, no alcohol endorsement);
- Incorporates consent verification results into the Legal Compliance critic's score; and
- Flags content that exceeds consent scope for immediate escalation regardless of other evaluation scores.

**Capability 5 — Agentic Pipeline Integration:** Operating as real-time evaluation middleware within autonomous agent pipelines, specifically enforcing character-specific fidelity policies. The system intercepts content produced by agents and sub-agents at configurable pipeline stages, evaluates each artifact against the applicable Character Card, and enforces configurable policy actions:
- **Pass**: Content proceeds in the pipeline, tagged with evaluation scores and certification status;
- **Regenerate**: Content is returned to the producing agent with structured remediation feedback identifying specific canon violations, voice inconsistencies, or brand safety issues by reference to the Character Card's canonical facts, voice profile, or safety specifications;
- **Quarantine**: Content is held for human review;
- **Escalate**: Content triggers an alert to designated reviewers (triggered automatically for performer consent scope violations and severe brand safety violations);
- **Block**: Content is rejected and a safe fallback is substituted.

The system supports pre-deployment agent certification against specific Character Cards and continuous runtime monitoring.

**Capability 6 — Continuous Improvement Flywheel:** A closed-loop system whereby evaluation results drive improvements to both the content-generating agents and the character-specific evaluation criteria:
- **Failure Pattern Detection**: The system identifies recurring failure modes across evaluation results, including cross-character patterns within a franchise that indicate insufficient Character Card detail or systematic agent weaknesses for specific character types;
- **Rubric Refinement**: When failure patterns indicate that evaluation criteria are too strict, too lenient, or missing coverage, the system generates character-specific rubric refinement suggestions for human review;
- **Character Card Enrichment Suggestions**: When canon fidelity failures result from missing canonical facts or incomplete voice profiles, the system identifies the specific knowledge gaps and suggests additions to the Character Card;
- **Agent Feedback Signals**: Structured evaluation feedback (dimension scores, explanations, failure reasons referencing specific Character Card fields) is formatted as agent-consumable directives;
- **Re-evaluation**: After agents are updated or rubrics are refined, the system re-executes evaluation suites to measure improvement, creating a measurable improvement trajectory.

All rubric refinement suggestions are presented to authorized human reviewers for approval before taking effect. The system does not autonomously modify evaluation criteria.

**Capability 7 — Franchise-Level Evaluation:** Evaluating AI-generated content not only for individual character fidelity but for consistency across an entire franchise. The system:
- Maintains relationship graphs across characters within a franchise;
- Evaluates whether content depicting multiple characters maintains correct inter-character relationships;
- Detects cross-character world-building inconsistencies (e.g., conflicting canonical facts about the shared fictional world);
- Aggregates evaluation metrics at the franchise level, enabling IP owners to monitor the overall canonical health of their intellectual property; and
- Identifies which characters within a franchise are most susceptible to canon drift.

**Capability 8 — Scale Architecture:** Operating at the throughput required by autonomous content production through:
- Queue-based evaluation processing with configurable priority tiers;
- Distributed Judge model dispatch across multiple model instances;
- Tiered evaluation (rapid screening followed by deep evaluation for borderline cases);
- Cost-optimized evaluation routing based on content risk level and evaluation urgency.

**Capability 9 — Certification and Compliance Reporting:** Awarding and revoking content certifications (in one embodiment, "CanonSafe Certified") based on evaluation results, and generating compliance reports suitable for IP owner governance, regulatory filings, and third-party audit.

**Capability 10 — Taxonomy-Driven Evaluation Configuration:** Maintaining a hierarchical taxonomy system comprising categories and tags that standardize character metadata, prohibited content specifications, and evaluation criteria across an entire franchise or organization. The taxonomy enables consistent application of evaluation standards across characters while allowing character-specific customization, and supports organization-level governance of what content types, traits, and relationships are recognized within the evaluation framework.

### DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENT

#### A. System Architecture

The preferred embodiment comprises a cloud-hosted evaluation platform (the "Evaluation Service") accessible via a RESTful API and integrable as middleware in agentic content production pipelines. The system comprises the following components:

1. **API Gateway Layer** (110): Receives evaluation requests from human-initiated API calls, automated agent pipelines, and webhook-triggered events. Authenticates callers via JWT tokens. All data is scoped to an organization (multi-tenant architecture).

2. **Character Card Service** (120): Manages CRUD operations on Character Cards and their versioned contents including all five packs (Canon, Legal, Safety, Visual Identity, Audio Identity). Cards progress through a status workflow: draft -> pending_approval -> approved -> archived.

3. **Evaluation Engine** (130): The core of the invention. Receives content artifacts of any modality, identifies the applicable Character Card, assembles evaluation context from the card version by extracting the relevant pack data, dynamically constructs per-critic evaluation prompts using the Character Card's specific canonical data, dispatches evaluations to the appropriate Judge models via the Critics Framework, aggregates scores, determines pass/fail, and returns complete results. The Evaluation Engine uses the Character Card exclusively as an *evaluation reference standard* — the Character Card data is incorporated into evaluation prompts for scoring, not provided to any content-generating model.

4. **Critics Framework Service** (135): Manages the registry of available critic modules, their configuration per organization, prompt templates with Character Card placeholder variables, scoring parameters, weights, and thresholds. Supports runtime addition and modification of critics without system restart. Each critic's prompt template contains placeholder variables (e.g., `{canon_facts}`, `{voice_profile}`, `{prohibited_topics}`, `{performer_consent}`) that are populated from the applicable Character Card version at evaluation time.

5. **Performer Consent Verification Service** (136): A specialized service that verifies AI-generated content against performer consent records in the Character Card's Legal Pack. Performs automated scope checks including consent validity, territorial authorization, modality authorization, and usage restriction compliance. Operates as a hard gate in the evaluation pipeline — content that fails consent verification is flagged for immediate escalation regardless of other evaluation scores.

6. **Agentic Pipeline Middleware** (137): A lightweight integration layer that can be deployed as a sidecar, webhook interceptor, or SDK within agentic orchestration systems. Intercepts agent outputs, routes them to the Evaluation Engine, and enforces policy actions based on evaluation results. Structured remediation feedback references specific Character Card fields (e.g., "canon_facts.hometown contradicted," "voice_profile.vocabulary_level exceeded") to provide actionable character-specific guidance to producing agents.

7. **Continuous Improvement Engine** (139): Analyzes accumulated evaluation results to detect failure patterns, generate character-specific rubric refinement suggestions, produce structured agent feedback signals, and track improvement trajectories over time. Includes franchise-level pattern analysis.

8. **Test Suite Service** (140): Manages collections of test cases organized by category and modality. Enables batch evaluation runs and pre-deployment agent certification against specific Character Card versions.

9. **LLM Adapter Layer** (150): Abstracts communication with Judge models across providers and modalities. Routes text evaluations to text-capable models, image evaluations to vision-language models, audio evaluations to audio-capable models, and video evaluations to video-understanding models.

10. **Taxonomy Service** (155): Manages hierarchical taxonomy categories and tags that standardize prohibited content specifications, character traits, content ratings, and relationship types across the organization. Taxonomy tags are referenced by Character Cards and critic configurations to ensure consistent evaluation standards.

11. **Franchise Evaluation Service** (157): Aggregates evaluation results and Character Card data at the franchise level, enabling cross-character consistency evaluation, franchise-level health monitoring, and detection of world-building inconsistencies.

12. **Data Layer** (160): Relational database storing Organizations, Users, Franchises, Character Cards, Card Versions, Critic Configurations, Taxonomy Categories, Taxonomy Tags, Test Suites, Test Cases, Evaluation Runs, Evaluation Results, Failure Patterns, and Improvement Trajectories.

Referring now to FIG. 1, the system architecture is shown schematically. Client applications and agentic pipelines (100) communicate with the API Gateway (110) which authenticates requests and routes them to the Character Card Service (120), the Evaluation Engine (130), the Critics Framework Service (135), the Performer Consent Verification Service (136), the Agentic Pipeline Middleware (137), the Continuous Improvement Engine (139), the Test Suite Service (140), the Taxonomy Service (155), or the Franchise Evaluation Service (157). The Evaluation Engine (130) communicates with the LLM Adapter Layer (150) to submit evaluation prompts to the appropriate Judge models. All services read from and write to the Data Layer (160).

#### B. Character Card Data Model

Referring now to FIG. 2, a Character Card Version (the immutable evaluation-time snapshot) is shown with the following structured fields:

**Canon Pack (200):**
- `canon_facts` (210): A JSON object mapping fact keys to values with optional source citations. Example: `{"hometown": {"value": "A small house on a hill", "source": "Season 1, Episode 1"}, "favorite_activity": {"value": "jumping in muddy puddles", "source": "Season 1, Episode 1"}}`
- `canon_voice` (220): A JSON object containing personality description, tone, speech style, vocabulary level, and catchphrases. Example: `{"personality": "cheerful, bossy, confident", "tone": "enthusiastic, matter-of-fact", "speech_style": "simple sentences, direct statements", "vocabulary_level": "age 4-6", "catchphrases": ["snort!", "silly daddy"]}`
- `canon_relationships` (230): A JSON array of relationship entries, each containing an entity name, relationship type (drawn from the organizational taxonomy), and optional notes. Example: `[{"entity": "George Pig", "relationship": "younger brother", "notes": "Peppa is sometimes bossy with George but loves him"}]`

**Legal Pack (240):**
- `legal_rights` (250): A JSON object containing IP owner, licensed territories, and validity dates. Example: `{"owner": "Hasbro/Entertainment One", "territories": ["worldwide"], "valid_from": "2024-01-01", "valid_to": "2026-12-31"}`
- `legal_performer_consent` (260): A JSON object containing performer name, consent type (AI_DIGITAL_REPLICA, VOICE_ONLY, FULL_LIKENESS), consent date, expiration date, territory restrictions, usage restrictions, strike clause status, and SAG-AFTRA agreement reference. Example: `{"performer": "Harley Bird", "consent_type": "VOICE_ONLY", "consent_date": "2024-03-15", "expiration_date": "2026-03-15", "territories": ["US", "UK", "EU"], "restrictions": ["no_political_content", "no_alcohol_endorsement"], "strike_clause": false, "agreement_ref": "SAG-AFTRA-2024-RPC-001"}`

**Safety Pack (270):**
- `safety_content_rating` (280): A string value from a defined set: G, PG, PG-13, R.
- `safety_prohibited_topics` (282): A JSON array of topic strings (drawn from the organizational taxonomy) that must not appear in any modality, each with a severity level.
- `safety_required_disclosures` (284): A JSON array of disclosure strings that should appear when contextually relevant.
- `safety_age_gating` (286): A JSON object specifying whether age verification is required and the minimum age.

**Visual Identity Pack (290):**
- `visual_color_specs` (291): A JSON object containing brand color definitions with precise color values (hex, RGB, PMS). Example: `{"primary_blue": {"hex": "#003087", "pms": "PMS 287 C", "tolerance": "delta_e_2"}, "optimus_red": {"hex": "#FF0000", "pms": "PMS 185 C"}}`
- `visual_character_appearance` (292): A JSON object describing the character's visual appearance including body proportions, distinctive features, clothing, and accessories. Example: `{"body_type": "round pig shape", "skin_color": "pink", "distinctive_features": ["round cheeks", "small curly tail"], "clothing": "red dress (Peppa), blue top (George)"}`
- `visual_style_guide` (293): A JSON object containing approved art styles, prohibited visual elements, logo usage rules, and background/setting requirements. Example: `{"approved_styles": ["2D flat animation", "simple line art"], "prohibited_elements": ["realistic rendering", "dark shadows", "blood"], "logo_placement": "bottom-right corner"}`

**Audio Identity Pack (295):**
- `audio_voice_specs` (296): A JSON object containing voice characteristics for the character: pitch range, cadence, accent, emotional range, and speech rate. Example: `{"pitch": "high, child-like", "cadence": "bouncy, energetic", "accent": "British RP", "speech_rate": "moderate", "emotional_range": ["happy", "bossy", "curious", "giggly"]}`
- `audio_music_specs` (297): A JSON object containing approved musical themes, instrumentation guidelines, and prohibited audio elements. Example: `{"approved_themes": ["playful woodwind", "xylophone melodies"], "prohibited_audio": ["heavy bass", "electronic music", "aggressive percussion"]}`

Each Character Card is uniquely associated with:
- A **Franchise** (300): An IP collection (e.g., "Peppa Pig," "Star Wars") owned by an Organization, containing multiple related Character Cards that share a canonical world
- An **Organization** (310): The IP owner (e.g., a studio, publisher, or brand)
- One or more **Card Versions** (320): Immutable snapshots, each with an incrementing version number

Unlike character profile systems designed for content generation (see References 1, 6 in the Prior Art section), the Character Card data model is specifically structured to support *evaluation* of independently-generated content. Each field is designed to enable a Judge model to assess whether existing content conforms to the canonical specification, not to instruct a generative model on how to create content.

#### C. Core Evaluation Method — Multi-Modal Evaluation Pipeline

##### C.1 Single-Artifact Evaluation

Referring now to FIG. 3, the evaluation pipeline is shown as a flow diagram:

1. A caller submits (400) an evaluation request via the API containing: `{character_card_id, prompt, content_artifact, modality}`, where `character_card_id` identifies the Character Card, `prompt` is the input that was presented to the AI system (if applicable), `content_artifact` is the AI-generated output to be evaluated (text string, image data, video data, or audio data), and `modality` specifies the content type (text, image, video, audio, or mixed).

2. The system authenticates (410) the caller and verifies organizational access.

3. The system retrieves (420) the Character Card's current approved version containing the full five-pack structure.

4. The system extracts (430) the relevant packs from the Character Card version into a unified evaluation context dictionary. For text evaluation, the Canon Pack and Safety Pack are primary. For image evaluation, the Visual Identity Pack is added. For audio evaluation, the Audio Identity Pack is added. For video evaluation, all packs are assembled. For mixed-modality content, all applicable packs are assembled.

5. The system performs (432) a performer consent pre-check via the Performer Consent Verification Service. If the content modality exceeds the scope of performer consent (e.g., an image or video artifact when only VOICE_ONLY consent exists), the system immediately flags the content for escalation and records a legal compliance failure, bypassing further evaluation.

6. The system queries (435) the Critics Framework Service to retrieve the active critic configuration for the organization (and optionally for the specific franchise or character), including: which critics are enabled, their weights, thresholds, prompt templates, and any critical rules.

7. The system dynamically assembles (438) each critic's evaluation prompt by populating the prompt template's placeholder variables with the specific Character Card data. For example, the Canon Fidelity critic's prompt template `"Evaluate whether the following content accurately reflects the canonical facts: {canon_facts}"` is populated with the specific character's canon_facts JSON. This ensures each evaluation is grounded in the specific character's canonical profile.

8. The system dispatches (440) independent evaluation requests to the appropriate Judge models through the Critics Framework. Each enabled critic produces an evaluation:

   **Canon Fidelity Critic (441):**
   For text and audio content: The Judge model receives the character's specific canon facts database, the relationship graph, the original prompt (if available), and the content artifact. It evaluates factual accuracy, relationship accuracy, and lore consistency against the character's specific canonical record. For audio content containing speech, the system first transcribes the audio to text before canon evaluation. The Judge returns a numerical score (0-100) and a natural language explanation identifying specific canon deviations.

   **Voice Consistency Critic (442):**
   For text content: The Judge model evaluates personality match, tone appropriateness, vocabulary consistency, and speech pattern fidelity against the character's specific voice profile from the Canon Pack. For audio content: The Judge model additionally evaluates vocal characteristics (pitch, cadence, accent) against the character's Audio Identity Pack voice specifications. The Judge returns a score (0-100) and explanation.

   **Brand Safety Critic (443):**
   For all modalities: The Judge model evaluates content rating compliance against the character's specific content rating, prohibited topic or element avoidance against the character's specific prohibited topics (drawn from the organizational taxonomy), required disclosure inclusion, and overall brand protection. For image and video content, visual prohibited elements are evaluated. Any violation of the character's prohibited content results in a score below a critical threshold. The Judge returns a score (0-100) and explanation.

   **Legal Compliance Critic (444):**
   For all modalities: The Judge model evaluates whether usage falls within performer consent scope (incorporating results from the Performer Consent Verification Service), respects territory restrictions and usage limitations, and includes required legal notices as specified in the character's Legal Pack. The Judge returns a score (0-100) and explanation.

   **Visual Identity Critic (445) (image and video modalities):**
   A vision-capable Judge model receives the character's specific Visual Identity Pack specifications and the image or video content. It evaluates color accuracy (comparing rendered colors against the character's brand color specifications within defined tolerances), character appearance accuracy against the character's specific appearance description, art style compliance, logo placement, and absence of the character's prohibited visual elements. The Judge returns a score (0-100) and explanation.

   **Audio Identity Critic (446) (audio and video modalities):**
   An audio-capable Judge model (or a multi-modal model capable of audio analysis) receives the character's specific Audio Identity Pack specifications and the audio content. It evaluates voice characteristic matching (pitch, cadence, accent compliance against the character's specifications), music/sound appropriateness, and absence of the character's prohibited audio elements. The Judge returns a score (0-100) and explanation.

   **Custom Critics (447+):**
   Any additional organization-defined critics are dispatched in parallel using their configured prompt templates populated with the applicable Character Card data.

9. Referring now to FIG. 4, the scoring computation is shown in detail. The system computes (450) a weighted aggregate score by applying configurable weights to each active critic's score:

    total_score = SUM (critic_score_i x W_i) for all active critics i

   where W_i are configurable positive real numbers summing to 1.0. In the preferred embodiment for text-only evaluation, default weights are: W_canon = 0.30, W_voice = 0.25, W_safety = 0.30, W_legal = 0.15. When visual or audio critics are active, the weights are redistributed according to the organization's configuration. Weights may be further customized per franchise or per character.

10. The system checks (460) each critic's score against its configurable threshold. Any critic scoring below its threshold generates a failure reason string identifying the critic, the dimension, and the deficit.

11. The system determines (470) pass/fail: the content passes if and only if the failure_reasons list is empty (all active critics met their thresholds) AND the performer consent pre-check passed.

12. If the content passed AND the aggregate total_score exceeds a certification threshold (default: 85.0), the content receives (480) an elevated certification status (in one embodiment, "CanonSafe Certified").

13. The system persists (490) the complete evaluation result, including all critic scores, explanations, the aggregate score, pass/fail determination, failure reasons, performer consent verification status, evaluation latency, modality metadata, the Character Card version identifier, and the content artifact's hash (for audit traceability without storing the content itself).

14. The system returns (495) the complete result to the caller, including all per-critic scores, explanations, the aggregate score, pass/fail status, failure reasons, certification status, and (when applicable) structured remediation suggestions referencing specific Character Card fields.

##### C.2 Batch Evaluation (Test Suite Run)

The batch evaluation process extends the single-artifact evaluation described above and in FIG. 3:

1. A caller submits a request specifying a Character Card identifier, a Test Suite identifier, and optionally model configuration parameters and modality filters.

2. The system retrieves the Test Suite and its associated Test Cases. Each Test Case is categorized (e.g., canon, voice, safety, refusal, edge_case, visual_consistency, audio_fidelity) and contains a prompt and/or reference content, and an expected behavior description.

3. For each Test Case, the system executes the full multi-modal evaluation described in Section C.1 above.

4. The system aggregates results: total tests executed, tests passed, tests failed, per-critic average scores, per-category pass rates, and per-modality breakdowns.

5. The system stores the EvalRun with aggregate statistics and individual EvalResults per test case, enabling drill-down analysis.

##### C.3 Real-Time Guardrail Mode

In a further embodiment, the method operates as a real-time middleware interceptor in a character AI conversation pipeline:

1. A user message is received (500) by the character AI application.

2. **Pre-check** (510): The user message is validated for safety and prompt injection attempts.

3. The validated message is routed (520) to a configured LLM to generate a character response.

4. **Post-check** (530): The generated response is evaluated against the Character Card using the full evaluation method described in Section C.1, including performer consent verification.

5. If the response passes (540): The response is transmitted to the user.

6. If the response fails (550): The system either: (a) regenerates the response with stricter prompt parameters informed by the specific evaluation failures, or (b) transmits a predetermined safe fallback response appropriate to the character.

7. The complete interaction is logged (560) with evaluation scores, enabling continuous monitoring and audit.

#### D. Extensible Character-Specific Critics Framework

Referring now to FIG. 11, the critics framework architecture is shown:

1. **Critic Registry** (1100): A managed catalog of all available critic modules, each defined by:
   - A unique critic identifier and name
   - A description of what the critic evaluates
   - A prompt template with placeholder variables for Character Card data (e.g., `{canon_facts}`, `{voice_profile}`, `{prohibited_topics}`, `{color_specs}`, `{performer_consent}`) and content artifact
   - Scoring anchor points (what constitutes a 0 and a 100 for this critic)
   - Critical rules (bright-line conditions that force specific score ranges)
   - Applicable modalities (which content types this critic can evaluate)
   - Required Character Card packs (which packs must be present for this critic to operate)

2. **Organization Critic Configuration** (1110): Each organization configures which critics are active, their weights, and their thresholds. This configuration is stored per-organization and may be further customized per-franchise or per-character.

3. **Default Critics** (1120): The system ships with the following default critics:
   - Canon Fidelity (text, audio): Evaluates factual accuracy against the character's specific canonical facts
   - Voice Consistency (text, audio): Evaluates personality and speech pattern matching against the character's specific voice profile
   - Brand Safety (all modalities): Evaluates content appropriateness against the character's specific content rating and prohibited content
   - Legal Compliance (all modalities): Evaluates performer consent scope, territory restrictions, and required notices against the character's specific legal pack
   - Visual Identity (image, video): Evaluates visual brand consistency, color accuracy, and character appearance against the character's specific visual identity pack
   - Audio Identity (audio, video): Evaluates voice characteristics and audio brand consistency against the character's specific audio identity pack

4. **Custom Critic Creation** (1130): Organizations may create custom critics by providing:
   - A prompt template that references Character Card data via placeholder variables and content artifacts
   - Scoring parameters (anchor points, critical rules, default weight, default threshold)
   - Applicable modalities
   - Any additional context data the critic requires (stored as custom fields in the Character Card)

   Examples of custom critics that organizations might create:
   - **Fan Sentiment Critic**: Evaluates whether content would be received positively by the character's fan community
   - **Competitive Differentiation Critic**: Evaluates whether content sufficiently differentiates the character from competitors' similar characters
   - **Cultural Sensitivity Critic**: Evaluates content for cultural appropriateness across specified markets
   - **Accessibility Critic**: Evaluates whether content meets accessibility standards (alt text for images, caption accuracy for video)
   - **Continuity Critic**: Evaluates whether content is consistent with other recently generated content for the same character (avoiding self-contradiction across outputs)
   - **Franchise Consistency Critic**: Evaluates whether content maintains consistency with the broader franchise world-building

5. **Critic Composition** (1140): Multiple critics may be composed into named evaluation profiles. For example, a "Children's Character Profile" might weight Brand Safety at 0.40 and add a custom Age-Appropriateness Critic, while a "Mature Character Profile" might reduce Brand Safety weight and add a Narrative Quality Critic.

#### E. Agentic Pipeline Evaluation Mode

Referring now to FIG. 8, the agentic pipeline evaluation architecture is shown:

##### E.1 Pipeline Middleware Integration

The system provides an integration layer (the "Agentic Pipeline Middleware" or "APM") that operates within autonomous agent orchestration systems, specifically enforcing character-specific fidelity policies rather than general safety policies. The APM may be deployed as:

1. **SDK Integration** (810): A software library imported directly into agent code, providing `evaluate()` and `enforce()` function calls that an agent invokes before emitting content.

2. **Sidecar Service** (820): A co-deployed microservice that intercepts agent outputs via message queue or network proxy, evaluates them, and either forwards or blocks them based on character-specific policy.

3. **Webhook Interceptor** (830): An HTTP endpoint registered as a post-processing webhook in agent orchestration platforms, receiving agent outputs and returning policy enforcement decisions.

4. **API Gateway Filter** (840): A middleware layer in an API gateway that evaluates outbound content before it reaches downstream consumers (other agents, human users, or external systems).

##### E.2 Agent Output Evaluation Flow

When the APM receives a content artifact from an agent:

1. The APM identifies (850) the applicable Character Card based on the agent's configuration, the content's character association, or metadata tags.

2. The APM submits (855) the content artifact to the Evaluation Engine via the internal API, specifying the Character Card, modality, and evaluation urgency (real-time, near-real-time, or batch).

3. The Evaluation Engine executes (860) the full multi-critic evaluation described in Section C.1, including performer consent verification.

4. The APM receives (865) the evaluation result and applies the organization's enforcement policy:

   - **Pass** (score above all thresholds, consent verified): The content artifact is released into the pipeline, tagged with its evaluation scores and certification status.

   - **Regenerate** (score below threshold but above a regeneration floor): The content artifact is returned to the producing agent along with structured feedback containing: which critics failed, what the specific deficiencies were (from critic explanations, referencing specific Character Card fields), and explicit remediation instructions. For example: "Canon Fidelity failed: content states character lives in London, but canon_facts.hometown specifies 'a small house on a hill' (source: Season 1, Episode 1). Please regenerate with correct hometown." A configurable maximum number of regeneration attempts is enforced (default: 3) before escalation.

   - **Quarantine** (score below regeneration floor but above block threshold, or maximum regeneration attempts exceeded): The content artifact is placed in a review queue for human examination. A designated reviewer is notified with the content, evaluation scores, and critic explanations.

   - **Escalate** (specific critical rules triggered, such as performer consent scope violation, legal compliance failure, or severe brand safety violation): An immediate alert is sent to designated personnel (e.g., legal team, brand safety officer) with full evaluation details. The content is blocked pending human decision. Performer consent scope violations always trigger escalation.

   - **Block** (score below block threshold): The content artifact is rejected. A safe fallback artifact is substituted if one is configured for the character and context. The blocked content and evaluation details are logged for audit.

##### E.3 Pre-Deployment Agent Certification

Before an agent is deployed into production, the system supports a certification evaluation process specifically testing the agent's ability to portray specific characters faithfully:

1. A test suite is executed against the agent, presenting it with a diverse corpus of prompts spanning canonical knowledge about the specific character, edge cases targeting known character-specific pitfalls, adversarial inputs designed to elicit out-of-character responses, and multi-modal generation tasks appropriate to the character.

2. The agent's outputs are evaluated using the full evaluation pipeline against the specific Character Card.

3. The system computes an agent-level certification score: the aggregate pass rate, per-critic average scores, and worst-case dimension scores across the test suite.

4. If the agent's certification score meets the organization's deployment threshold, the agent receives a deployment certification with a validity period. If the agent fails, a detailed failure report identifies the specific areas requiring improvement before re-certification, referencing specific Character Card fields where the agent demonstrated weakness.

5. Certifications are versioned and linked to both the agent version and the Character Card version used during certification, enabling traceability. This differs from general AI compliance validation systems (see Reference 2) in that certification is tied to specific intellectual property profile versions rather than general regulatory guidelines.

##### E.4 Continuous Runtime Monitoring

Once deployed, agents are continuously monitored:

1. Every content artifact produced by the agent is evaluated (in real-time or sampled, per configuration).

2. The system tracks the agent's rolling evaluation metrics per character: pass rate, average scores per critic, failure frequency, and score trends over time.

3. If an agent's rolling metrics degrade below configured alert thresholds (e.g., pass rate drops below 90% over a 24-hour window), the system generates an alert and may automatically take the agent offline pending investigation.

4. The monitoring data feeds into the Continuous Improvement Engine (Section F).

##### E.5 Sub-Agent Evaluation

In agentic systems where a master agent orchestrates multiple sub-agents, each sub-agent's output may be independently evaluated:

1. The APM is deployed at each sub-agent output boundary.

2. Each sub-agent's output is evaluated against the applicable Character Card (which may be the same card or different cards if sub-agents handle different characters).

3. The master agent's aggregated output (which may combine outputs from multiple sub-agents) is separately evaluated as a composite artifact, including cross-character consistency when multiple characters are portrayed.

4. This hierarchical evaluation ensures that failures in sub-agent outputs are caught before they propagate through the pipeline, and that the combined output maintains overall coherence.

#### F. Continuous Improvement Flywheel

Referring now to FIG. 10, the continuous improvement flywheel is shown as a circular process:

##### F.1 Failure Pattern Detection (1010)

The Continuous Improvement Engine analyzes accumulated evaluation results to identify recurring failure patterns:

1. **Dimension-Level Patterns**: Identifying when a specific critic consistently produces low scores (e.g., voice consistency scores are systematically lower than other dimensions across all agents).

2. **Agent-Level Patterns**: Identifying when a specific agent or agent class consistently fails on particular critics (e.g., social media agents score well on brand safety but poorly on canon fidelity).

3. **Prompt-Level Patterns**: Identifying categories of inputs that consistently trigger evaluation failures (e.g., questions about character relationships produce more canon fidelity failures than questions about character activities).

4. **Temporal Patterns**: Identifying when evaluation scores degrade over time, potentially indicating model drift in the content-generating agents or the Judge models.

5. **Cross-Character Patterns**: Identifying when certain characters within a franchise are systematically harder to portray correctly, potentially indicating insufficient Character Card detail for those characters.

6. **Franchise-Level Patterns**: Identifying when content depicting interactions between specific characters consistently fails, potentially indicating incomplete or contradictory relationship specifications across Character Cards within the franchise.

##### F.2 Rubric Refinement (1020)

Based on identified failure patterns, the system generates rubric refinement suggestions:

1. **Threshold Adjustment Recommendations**: When false positive rates (good content failing) or false negative rates (bad content passing) exceed acceptable levels, the system suggests threshold adjustments with supporting statistical evidence.

2. **Weight Rebalancing Recommendations**: When certain critics are dominating or being ignored due to weight imbalances, the system suggests weight redistributions.

3. **Prompt Template Refinements**: When critic evaluations produce inconsistent or ambiguous results, the system suggests modifications to the critic's prompt template, such as adding more specific anchor points or critical rules.

4. **New Critic Suggestions**: When failure patterns indicate gaps in the evaluation framework (e.g., a category of failures not captured by any existing critic), the system suggests the creation of a new custom critic with a proposed prompt template.

5. **Character Card Enrichment Suggestions**: When canon fidelity failures result from missing canonical facts, the system identifies the specific knowledge gaps and suggests additions to the Character Card. For example: "Canon Fidelity failures frequently cite character's school — recommend adding school name and details to canon_facts."

6. **Taxonomy Tag Additions**: When prohibited content violations involve topics not yet covered by the organizational taxonomy, the system suggests new taxonomy tags for inclusion.

All rubric refinement suggestions are presented to authorized human reviewers for approval before taking effect. The system does not autonomously modify evaluation criteria.

##### F.3 Agent Feedback Signals (1030)

The system produces structured feedback signals consumable by content-generating agents:

1. **Per-Artifact Feedback**: For each failed evaluation, the system produces a structured feedback document containing: which critics failed, the specific deficiency identified by each failing critic (referencing specific Character Card fields), and explicit remediation instructions. This feedback is formatted as a machine-readable directive that can be appended to an agent's context or system prompt.

2. **Aggregate Performance Reports**: Periodic summaries of an agent's evaluation performance per character, highlighting systematic weaknesses and improvement trends. These reports can be incorporated into an agent's system prompt to provide self-awareness of known weaknesses with specific characters.

3. **Exemplar Outputs**: The system maintains a library of high-scoring content artifacts (those receiving elevated certification) organized by character, modality, and content type. These exemplars can be provided to agents as few-shot examples of high-quality output for specific characters.

##### F.4 Re-Evaluation and Improvement Tracking (1040)

After agents are updated or rubrics are refined:

1. The system re-executes the certification test suite against the updated agent or with the updated rubric configuration.

2. Results are compared against the baseline (the most recent prior evaluation of the same test suite).

3. The system computes an improvement trajectory: which dimensions improved, which regressed, and the net quality change.

4. Improvement trajectories are tracked longitudinally, enabling organizations to measure the effectiveness of their continuous improvement process over time.

5. The system identifies when improvement plateaus (diminishing returns on rubric or agent adjustments) and recommends more fundamental interventions (e.g., Character Card enrichment, Judge model upgrade, or agent architecture change).

#### G. Multi-Modal Evaluation Methods

Referring now to FIG. 9, the multi-modal evaluation framework is shown:

##### G.1 Text Evaluation (910)

Text evaluation follows the method described in Section C.1, using text-capable Judge LLMs. The Judge LLM receives the relevant Character Card pack data and the text content, and returns per-critic scores and explanations.

##### G.2 Image Evaluation (920)

For image content (photographs, illustrations, generated artwork, marketing assets):

1. The system identifies (921) the image content and retrieves the Visual Identity Pack from the Character Card.

2. The system dispatches (922) the image to a vision-language Judge model (e.g., a model capable of both image understanding and text generation) along with the character's specific Visual Identity Pack specifications.

3. The Judge model evaluates (923):
   - **Color Accuracy**: Whether rendered colors match the character's brand color specifications within defined tolerances. The evaluation prompt includes the character's specific color values (hex, PMS) and tolerance parameters.
   - **Character Appearance**: Whether the character's visual depiction matches the character's described appearance (body proportions, distinctive features, clothing, accessories).
   - **Art Style Compliance**: Whether the image's art style matches the character's approved styles and avoids prohibited styles.
   - **Logo and Brand Element Compliance**: Whether logos, watermarks, and brand elements are placed correctly and rendered accurately per the character's specifications.
   - **Prohibited Visual Elements**: Whether the image contains any of the character's visually prohibited elements (e.g., violence, age-inappropriate imagery, competitor references).

4. The Judge model returns (924) per-criterion scores that feed into the Visual Identity Critic and Brand Safety Critic.

##### G.3 Video Evaluation (930)

For video content (animated clips, promotional videos, character-featuring content):

1. The system identifies (931) the video content and retrieves all relevant Character Card packs.

2. The system performs (932) temporal decomposition: extracting representative frames at configurable intervals (e.g., one frame per second or at scene changes) and extracting the audio track separately.

3. Frame-level evaluation (933): Each representative frame is evaluated as an image using the method described in Section G.2, producing per-frame visual consistency scores.

4. Temporal consistency evaluation (934): The system evaluates whether visual elements remain consistent across frames — for example, whether a character's color remains consistent throughout the video, or whether prohibited visual elements appear in any frame.

5. Audio track evaluation (935): The extracted audio track is evaluated using the method described in Section G.4.

6. Narrative consistency evaluation (936): If the video contains dialogue (detected via speech-to-text transcription), the dialogue text is evaluated using the text evaluation method (Section G.1) for canon fidelity and voice consistency.

7. The system aggregates (937) frame-level, temporal, audio, and narrative scores into composite video evaluation scores per critic.

##### G.4 Audio Evaluation (940)

For audio content (synthesized speech, character voice, music, sound effects):

1. The system identifies (941) the audio content and retrieves the Audio Identity Pack from the Character Card.

2. For speech content, the system performs (942) speech-to-text transcription and evaluates the resulting text for canon fidelity and voice consistency using the text evaluation method (Section G.1).

3. For voice characteristics, the system dispatches (943) the audio to an audio-capable Judge model along with the character's specific Audio Identity Pack voice specifications. The Judge model evaluates:
   - **Voice Characteristic Matching**: Whether the voice's pitch, cadence, accent, and speech rate match the character's specified parameters.
   - **Emotional Consistency**: Whether the voice's emotional expression falls within the character's defined emotional range.
   - **Audio Brand Compliance**: Whether background music, sound effects, and audio mixing comply with the character's Audio Identity Pack specifications.
   - **Prohibited Audio Elements**: Whether the audio contains any of the character's prohibited audio elements.

4. The Judge model returns (944) per-criterion scores that feed into the Audio Identity Critic and Brand Safety Critic.

##### G.5 Mixed-Modality Evaluation (950)

For content artifacts containing multiple modalities (e.g., a social media post with text and an image, a video with visual and audio elements):

1. The system decomposes (951) the mixed-modality artifact into its component modalities.

2. Each modality component is evaluated (952) independently using the appropriate modality-specific method (Sections G.1-G.4).

3. A cross-modal consistency evaluation (953) is performed, assessing whether the different modalities are consistent with each other and with the Character Card — for example, whether the text caption accurately describes the image in a manner consistent with the character's voice profile, whether the audio narration matches the visual content, or whether the character's textual personality is consistent with the character's visual depiction and vocal characteristics. This cross-modal evaluation uses the Character Card as the shared reference standard across all modalities.

4. Per-modality scores and the cross-modal consistency score are aggregated (954) into a composite mixed-modality evaluation result.

#### H. Judge Model Prompt Engineering

The Judge model evaluation prompts are designed with the following principles:

1. **Role Specification**: Each prompt establishes the Judge as an "expert evaluator" for the specific dimension and modality.

2. **Character-Specific Context**: Each prompt is dynamically populated with the specific character's profile data from the applicable Character Card version, ensuring evaluations are grounded in the specific intellectual property rather than generic quality criteria.

3. **Explicit Scoring Criteria**: Each prompt enumerates 3-5 specific sub-criteria that the Judge must consider, tailored to the modality being evaluated.

4. **Anchor Points**: Each prompt defines what scores of 0 and 100 mean for the dimension and modality.

5. **Critical Rules**: Certain prompts include bright-line rules (e.g., "Any mention of the character's prohibited topics should result in a score below 50").

6. **Structured Output Format**: All prompts require the Judge to respond in a parseable format: `SCORE: [number 0-100]` followed by `EXPLANATION: [2-3 sentences]`.

7. **Low Temperature**: The Judge model operates at temperature 0.1 (near-deterministic) to maximize scoring consistency.

8. **Modality-Specific Instructions**: For vision evaluations, prompts include instructions to examine specific visual elements against the character's visual identity specifications. For audio evaluations, prompts include instructions to analyze specific audio characteristics against the character's audio identity specifications. For video evaluations, prompts include instructions to assess temporal consistency.

#### I. Model Agnosticism

A critical feature of the invention is model agnosticism in two directions:

1. **Content-Generating Model Agnosticism**: The system evaluates only the output content, not the model or agent that produced it. The underlying model (OpenAI GPT, Anthropic Claude, Google Gemini, Meta Llama, Mistral, open-source models, or any future model) is irrelevant to the evaluation process. This applies equally to content generated by individual models and content generated by orchestrated multi-agent systems.

2. **Judge Model Agnosticism**: The Judge model used for evaluation is configurable and may be any suitable model with the required capabilities. Text evaluation may use a different Judge model than image evaluation. Organizations may configure different Judge models for different critics.

Referring now to FIG. 6, this model-agnostic architecture is illustrated. Multiple different content sources — individual LLMs (600a, 600b), agentic pipelines (600c), and multi-agent systems (600d) — each generate content. All content is submitted to the Evaluation Service (610), which evaluates each artifact against the same Character Card (620) using the same critics framework. The evaluation results (630) are stored and compared regardless of which model or agent produced the content.

This enables:
1. IP owners to switch between LLM providers or agent platforms without recreating evaluation infrastructure
2. Cross-model comparison: running identical test suites against multiple providers to determine which best portrays a given character
3. Cross-agent comparison: evaluating different agent configurations against the same Character Card
4. Future-proofing: new models and agent architectures can be evaluated immediately without system changes
5. Marketplace potential: third-party developers can submit their agent outputs for evaluation and certification by the IP owner

#### J. Scale Architecture

The system is designed to operate at the throughput required by autonomous content production:

1. **Queue-Based Processing**: Evaluation requests are placed in a managed queue with configurable priority levels. Real-time evaluations (agent pipeline middleware) receive highest priority. Batch evaluations and retrospective audits receive lower priority.

2. **Distributed Judge Dispatch**: Multiple Judge model instances operate in parallel, with the LLM Adapter Layer load-balancing evaluation requests across available instances. Different Judge model providers may be used simultaneously.

3. **Tiered Evaluation**: For high-throughput scenarios, the system supports a two-tier evaluation strategy:
   - **Rapid Screen** (Tier 1): A lightweight evaluation using a faster, less expensive Judge model to quickly identify content that clearly passes or clearly fails.
   - **Deep Evaluation** (Tier 2): Content that scores near thresholds in the rapid screen is re-evaluated using a more capable (and more expensive) Judge model for definitive assessment.

4. **Sampling Modes**: For extremely high-volume agent pipelines, the system supports statistical sampling: evaluating a configurable percentage of agent outputs (e.g., 10%) while passing the remainder with a "sampled-pass" status. Statistical methods ensure that the sample is representative and that quality metrics are reliable.

5. **Cost Optimization**: The system tracks evaluation costs (model API usage) per organization, per agent, and per character, enabling organizations to balance evaluation thoroughness against cost.

#### K. Versioning and Longitudinal Tracking

Character Cards are versioned. Each version is immutable once published. This enables:

1. **Evaluation Reproducibility**: A given evaluation can always be re-traced to the exact Character Card version used.

2. **Canon Evolution Tracking**: As a character's canonical facts evolve, new card versions capture the evolution while preserving complete history.

3. **Regression Detection**: If a previously-passing agent begins failing after a model update, the system identifies the regression because evaluations are linked to specific card versions.

4. **Approval Workflow**: Card versions progress through draft -> pending_approval -> approved, with multi-stakeholder review.

Referring now to FIG. 7, the version lifecycle is shown: A new version is created in "draft" status (700), submitted for review in "pending_approval" status (710), approved and made the current version (720), and eventually archived when a newer version is approved (730). The previous version's evaluation history is preserved.

#### L. Taxonomy and Tag System

The preferred embodiment includes a hierarchical taxonomy system with categories and tags that standardize character metadata across the platform. The taxonomy enables:

- **Prohibited Content** tags with severity levels applied consistently across characters within a franchise, drawn from a centrally-managed organizational taxonomy
- **Character Traits** tags enabling cross-character analytics and franchise-level pattern detection
- **Content Ratings** with standardized definitions enforced across the franchise
- **Relationship Types** enabling consistent relationship graph modeling across all characters in a franchise
- **Modality-Specific Tags** (e.g., "animation_style:2d", "voice_type:child") enabling modality-appropriate evaluation configuration

The taxonomy system provides organizational governance over the vocabulary used in Character Cards, ensuring that prohibited topics, character traits, and relationship types are defined consistently rather than ad hoc per character. This centralized governance enables franchise-level evaluation aggregation and cross-character pattern detection.

#### M. Multi-Tenant Architecture

The system operates as a multi-tenant cloud service where:

1. Each **Organization** has isolated data — Character Cards, evaluations, critics configurations, taxonomy definitions, and results from one organization are not visible to or accessible by another organization.

2. **Users** belong to organizations and authenticate via JWT tokens.

3. **Franchises** provide a second level of organization within an organization, grouping related characters that share a canonical world.

4. **Role-based access control** enables different users to have different permissions.

#### N. Data Model Relationships

Referring now to FIG. 5, the entity-relationship diagram shows:

- **Organization** (800) has many **Users** (810), many **Franchises** (820), many **CriticConfigurations** (815), and many **TaxonomyCategories** (817)
- **TaxonomyCategory** (817) has many **TaxonomyTags** (818)
- **Franchise** (820) has many **CharacterCards** (830)
- **CharacterCard** (830) has many **CardVersions** (840), each containing five packs
- **CharacterCard** (830) has many **TestSuites** (850), each containing many **TestCases** (860)
- **CharacterCard** (830) has many **EvalRuns** (870), each containing many **EvalResults** (880)
- Each **EvalRun** (870) is linked to a specific **CardVersion** (840) and records the **modality** of the evaluated content
- **FailurePatterns** (890) are linked to **EvalResults** (880) and **CriticConfigurations** (815)
- **ImprovementTrajectories** (895) track changes in evaluation metrics over time per agent and per character
- **FranchiseEvaluationAggregates** (897) store franchise-level evaluation metrics and cross-character consistency scores

#### O. Performer Consent Verification Pipeline

The Performer Consent Verification Service implements a multi-step verification pipeline that operates as a hard prerequisite in the evaluation flow:

1. **Consent Record Retrieval** (O.1): The service retrieves the `legal_performer_consent` record from the applicable Character Card version. If no consent record exists, the service returns a warning status but does not block evaluation (the character may not have a real-world performer).

2. **Temporal Validation** (O.2): The service verifies that the current date falls within the consent's valid period (`consent_date` through `expiration_date`). Expired consent triggers immediate escalation.

3. **Territorial Validation** (O.3): If the evaluation request includes distribution territory metadata, the service verifies that the intended territories are within the consented territories. Territory violations trigger immediate escalation.

4. **Modality Scope Validation** (O.4): The service verifies that the content's modality falls within the consent scope:
   - `VOICE_ONLY` consent authorizes text and audio content but not image or video content depicting the performer's visual likeness.
   - `AI_DIGITAL_REPLICA` consent authorizes text, audio, image, and video content.
   - `FULL_LIKENESS` consent authorizes all modalities without restriction.
   A content artifact whose modality exceeds the consent scope triggers immediate escalation.

5. **Usage Restriction Validation** (O.5): The service evaluates the content against the consent's usage restrictions (e.g., `no_political_content`, `no_alcohol_endorsement`). This evaluation may invoke a specialized Judge model to determine whether the content falls within a restricted usage category.

6. **Strike Clause Check** (O.6): If the consent record indicates an active strike clause (`strike_clause: true`), the service checks whether the applicable labor agreement is currently in a strike status, which would suspend consent.

7. **Consent Verification Result** (O.7): The service returns a structured result comprising: overall consent status (valid/expired/exceeded/restricted/suspended), specific violations if any, and a recommendation for the Legal Compliance critic's evaluation. Content that fails consent verification at steps O.2-O.6 is flagged for mandatory escalation regardless of other evaluation scores.

#### P. Franchise-Level Evaluation

The Franchise Evaluation Service provides capabilities beyond individual character evaluation:

1. **Cross-Character Relationship Consistency** (P.1): When content depicts interactions between two or more characters within the same franchise, the service retrieves the relationship specifications from all involved Character Cards and verifies that the depicted interaction is consistent with the defined relationships. For example, if Character A's card specifies that A is B's parent, and content shows B referring to A by first name in a disrespectful manner, this may trigger a cross-character consistency failure (depending on the character's established dynamic).

2. **World-Building Consistency** (P.2): The service identifies canonical facts that are shared across multiple Character Cards within a franchise (e.g., the name of the town where all characters live, shared historical events) and verifies that content referencing these shared facts is consistent across characters.

3. **Franchise Health Dashboard** (P.3): The service aggregates evaluation metrics across all characters within a franchise, computing:
   - Overall franchise pass rate
   - Per-character pass rates and trends
   - Most commonly failing characters and dimensions
   - Cross-character consistency scores
   - Franchise-level canon drift indicators

4. **Character Gap Analysis** (P.4): The service identifies characters within a franchise that lack sufficient Character Card detail by analyzing evaluation failure patterns. Characters with higher failure rates due to missing canonical facts are flagged for Character Card enrichment.

#### Q. Taxonomy-Driven Evaluation Configuration

The Taxonomy Service provides centralized governance over the vocabulary and classification systems used throughout the evaluation framework:

1. **Hierarchical Category Management** (Q.1): The taxonomy defines top-level categories (e.g., "Prohibited Content," "Character Traits," "Content Ratings," "Relationship Types," "Visual Styles," "Audio Characteristics") with nested tags under each category.

2. **Tag-Based Evaluation Rules** (Q.2): Taxonomy tags carry metadata including severity levels, applicable modalities, and evaluation implications. For example, a "violence" tag under "Prohibited Content" with severity "critical" automatically maps to a brand safety critical rule that forces scores below a threshold.

3. **Franchise-Wide Consistency** (Q.3): When a new taxonomy tag is added (e.g., a new prohibited topic), it can be propagated across all Character Cards in a franchise, ensuring consistent evaluation standards.

4. **Evaluation Criteria Standardization** (Q.4): The taxonomy ensures that different Character Card authors within the same organization use consistent terminology for traits, relationships, and prohibited content, enabling meaningful cross-character analytics and franchise-level pattern detection.

### CLAIMS

**Claim 1.** A computer-implemented method for evaluating AI-generated content portraying intellectual property characters or brands, the content having been produced by autonomous agents or agentic workflows, the method comprising:

(a) storing, in a computer-readable data store, a structured intellectual property profile document associated with a specific character or brand, the profile document serving as an evaluation reference standard for scoring independently-generated content and not being used as an input to the content generation process, the profile document comprising at least: a canonical facts component containing machine-readable factual assertions about the character with source citations, a voice profile component specifying the character's personality traits, tone, speech style, vocabulary level, and catchphrases, a legal rights component containing performer consent information specifying consent type, scope, territorial restrictions, usage limitations, and expiration dates, a safety component containing a content rating and character-specific prohibited content specifications, and one or more modality-specific identity components specifying evaluation criteria for at least one of: visual appearance, audio characteristics, or video presentation;

(b) receiving, via a computer network interface, a content artifact produced by an autonomous AI agent or agentic workflow, together with an identifier of the applicable intellectual property profile document and a designation of the content modality;

(c) dynamically assembling evaluation prompts for a plurality of configurable evaluation critics by populating each critic's prompt template with character-specific data extracted from the applicable intellectual property profile document's component packs, and dispatching the content artifact to the plurality of critics, each critic independently evaluating the content against the character-specific profile data using a separate adjudicating AI model, wherein the plurality of critics includes at least critics for canon fidelity evaluating accuracy against the character's specific canonical facts, voice consistency evaluating conformance with the character's specific voice profile, brand safety evaluating compliance with the character's specific content rating and prohibited content, and legal compliance evaluating conformance with the character's specific performer consent scope and territorial restrictions;

(d) parsing, from each critic's adjudication, a numerical score on a normalized scale and a natural language explanation identifying specific deviations from the character's profile;

(e) computing a weighted aggregate score by applying configurable per-critic weights to the plurality of critic scores, wherein the weights are configurable per organization and further customizable per franchise or per character;

(f) determining a pass/fail outcome by comparing each critic score and the aggregate score against configurable threshold values;

(g) enforcing a policy action selected from the group consisting of: passing the content for distribution, returning the content to the producing agent with structured remediation feedback referencing specific fields of the intellectual property profile document, quarantining the content for human review, escalating the content to designated reviewers, or blocking the content and substituting a safe fallback; and

(h) storing the evaluation results in a persistent data store linked to the profile document version, the producing agent's identifier, and the content modality, enabling longitudinal quality tracking of intellectual property portrayal accuracy across agents, models, profile versions, modalities, and time periods.

**Claim 2.** The method of Claim 1, wherein the content artifact comprises one or more of: text, an image, a video, or an audio recording, and wherein the system selects modality-appropriate evaluation methods and Judge models for each modality present.

**Claim 3.** The method of Claim 1, wherein the configurable evaluation critics are implemented as pluggable modules registered in a critic registry, each module comprising a prompt template containing placeholder variables for character-specific profile data that are populated from the applicable intellectual property profile document at evaluation time, scoring anchor points, critical rules, applicable modality specifications, and required profile document component packs, and wherein organizations may create and register custom critic modules without modifying the core evaluation engine.

**Claim 4.** The method of Claim 1, further comprising operating as real-time middleware within an autonomous agent pipeline enforcing character-specific intellectual property fidelity policies by:
(a) intercepting content artifacts produced by agents at configurable pipeline stages;
(b) evaluating each intercepted artifact against the applicable intellectual property profile document using the method of Claim 1; and
(c) enforcing the determined policy action before the content proceeds further in the pipeline, wherein structured remediation feedback identifies specific character canon violations, voice profile deviations, or brand safety issues by reference to specific fields within the intellectual property profile document.

**Claim 5.** The method of Claim 4, wherein the middleware is deployable as one or more of: a software library integrated into agent code, a co-deployed sidecar service, a webhook interceptor, or an API gateway filter.

**Claim 6.** The method of Claim 1, further comprising a continuous improvement flywheel comprising:
(a) analyzing accumulated evaluation results to detect recurring failure patterns across dimensions, agents, prompt categories, time periods, characters, and franchises, including cross-character patterns indicating insufficient intellectual property profile detail;
(b) generating character-specific rubric refinement suggestions based on the detected failure patterns, including threshold adjustments, weight rebalancing, prompt template modifications, new critic suggestions, and intellectual property profile enrichment suggestions identifying specific knowledge gaps in the character's canonical record;
(c) producing structured agent feedback signals formatted as machine-readable directives consumable by content-generating agents, the feedback referencing specific intellectual property profile fields; and
(d) re-evaluating agent outputs after agent or rubric updates to compute improvement trajectories and measure the effectiveness of the improvement process.

**Claim 7.** The method of Claim 6, wherein the rubric refinement suggestions are presented to authorized human reviewers for approval before taking effect, and wherein the system does not autonomously modify evaluation criteria.

**Claim 8.** The method of Claim 1, wherein for image content, the evaluation comprises dispatching the image to a vision-language Judge model that evaluates color accuracy against the character's specific brand color specifications with defined tolerances, character appearance accuracy against the character's specific appearance description, art style compliance against the character's approved styles, and absence of the character's specific prohibited visual elements, using a Visual Identity component of the intellectual property profile document.

**Claim 9.** The method of Claim 1, wherein for video content, the evaluation comprises:
(a) decomposing the video into representative frames and an audio track;
(b) evaluating each representative frame for visual consistency against the character's visual identity specifications using image evaluation methods;
(c) evaluating temporal consistency of visual elements across frames;
(d) evaluating the audio track for voice characteristic matching against the character's audio identity specifications and audio brand compliance; and
(e) aggregating frame-level, temporal, audio, and narrative scores into composite video evaluation scores.

**Claim 10.** The method of Claim 1, wherein for audio content, the evaluation comprises:
(a) if the audio contains speech, transcribing the speech to text and evaluating the text for canon fidelity against the character's canonical facts and voice consistency against the character's voice profile;
(b) dispatching the audio to an audio-capable Judge model that evaluates voice characteristic matching against the character's specific voice specifications including pitch, cadence, accent, and speech rate; and
(c) evaluating compliance with the character's specific audio brand specifications including approved musical themes and prohibited audio elements.

**Claim 11.** The method of Claim 1, wherein for mixed-modality content comprising multiple modalities, the evaluation further comprises a cross-modal character consistency evaluation assessing whether the different modality components are consistent with each other and with the character's intellectual property profile document, including whether the character's textual voice, visual depiction, and audio characteristics collectively maintain a unified portrayal.

**Claim 12.** A computer-implemented method for certifying AI agents for intellectual property character content production, the method comprising:

(a) maintaining a versioned intellectual property profile document for a specific character, comprising canonical facts with source citations, a voice/personality profile, performer consent records, safety specifications, and modality-specific identity components;

(b) executing a character-specific test suite against an AI agent, the test suite comprising a plurality of test cases designed to probe the agent's fidelity to the specific character's canonical knowledge, voice profile, brand safety requirements, and legal compliance obligations, spanning canonical knowledge questions, character-specific edge cases, adversarial inputs targeting known character-specific pitfalls, and multi-modal generation tasks;

(c) evaluating each test case output against the specific character's intellectual property profile document across a plurality of configurable evaluation critics whose prompts are dynamically assembled from the character's profile data;

(d) computing an agent-level character-specific certification score comprising aggregate pass rates, per-critic average scores, and worst-case dimension scores;

(e) awarding a character-specific deployment certification when the agent-level certification score meets organizational deployment thresholds, the certification being linked to both the agent version and the intellectual property profile document version used during certification; and

(f) after deployment, continuously monitoring the agent's content outputs for the specific character by evaluating a configurable percentage of outputs and tracking rolling evaluation metrics, and generating alerts when rolling metrics degrade below configured thresholds.

**Claim 13.** The method of Claim 12, wherein the continuous monitoring supports automatic offline action when an agent's rolling pass rate for a specific character falls below a configured threshold within a configured time window.

**Claim 14.** The method of Claim 1, wherein in agentic systems where a master agent orchestrates multiple sub-agents, each sub-agent's output is independently evaluated against the applicable intellectual property profile document, and the master agent's aggregated output is separately evaluated as a composite artifact including cross-character consistency when multiple characters are portrayed, providing hierarchical evaluation that catches sub-agent failures before they propagate.

**Claim 15.** The method of Claim 1, wherein the system supports a tiered evaluation strategy comprising:
(a) a rapid screening tier using a faster Judge model to identify content that clearly passes or clearly fails; and
(b) a deep evaluation tier using a more capable Judge model for content that scores near thresholds in the rapid screening, thereby optimizing evaluation throughput and cost.

**Claim 16.** The method of Claim 1, further comprising maintaining a library of high-scoring exemplar content artifacts organized by character, modality, and content type, and providing selected exemplars to content-generating agents as few-shot examples of high-quality output for specific characters.

**Claim 17.** The method of Claim 1, wherein the structured remediation feedback returned to a producing agent comprises: identification of which critics failed, the specific deficiencies identified by each failing critic including references to specific fields of the intellectual property profile document (e.g., which canonical facts were contradicted, which voice profile attributes were violated), and explicit remediation instructions formatted as machine-readable directives, and wherein a configurable maximum number of regeneration attempts is enforced before escalation to human review.

**Claim 18.** The method of Claim 1, wherein the intellectual property profile document further comprises a Visual Identity component containing brand color definitions with precise color values and tolerances, character appearance descriptions, approved and prohibited art styles, and logo usage rules; and an Audio Identity component containing voice characteristic specifications, approved musical themes, and prohibited audio elements.

**Claim 19.** The method of Claim 1, wherein the first AI model producing the content and the adjudicating AI models used for evaluation are different models, and wherein the method is agnostic to the identity, provider, or architecture of the first AI model.

**Claim 20.** The method of Claim 1, wherein the adjudicating AI models comprise one or more of: a text-capable language model for text evaluation, a vision-language model for image evaluation, an audio-capable model for audio evaluation, and a multi-modal model for video and mixed-modality evaluation.

**Claim 21.** A computer-implemented method for continuous governance of AI-generated content portraying intellectual property characters, the method comprising:

(a) maintaining a structured intellectual property profile document defining character-specific canonical facts, voice/personality specifications, brand safety standards, legal compliance requirements including performer consent scope, and modality-specific identity standards;

(b) operating as middleware within an autonomous agent pipeline, intercepting content artifacts produced by agents;

(c) evaluating each content artifact against the intellectual property profile document using a configurable set of evaluation critics whose evaluation prompts are dynamically assembled from the character's specific profile data, each critic producing a numerical score and natural language explanation identifying specific deviations from the character's canonical profile;

(d) enforcing policy actions based on evaluation results, the policy actions comprising at least: passing, returning with character-specific feedback for regeneration, quarantining for human review, escalating to designated reviewers, and blocking with fallback substitution;

(e) analyzing accumulated evaluation results to detect recurring failure patterns including cross-character patterns within a franchise;

(f) generating structured feedback signals for content-generating agents based on evaluation results and failure patterns, the feedback referencing specific intellectual property profile fields;

(g) generating character-specific rubric refinement suggestions for human review based on failure patterns, including intellectual property profile enrichment suggestions; and

(h) tracking improvement trajectories by re-evaluating after agent or rubric updates.

**Claim 22.** The method of Claim 21, wherein the method operates across content modalities including text, images, video, and audio, dispatching modality-appropriate evaluation methods for each content type.

**Claim 23.** The method of Claim 1, wherein the intellectual property profile document is immutably versioned, such that each modification creates a new version while preserving prior versions, and wherein each evaluation result is linked to the specific version used during evaluation.

**Claim 24.** The method of Claim 1, further comprising embedding content provenance metadata conforming to the C2PA (Coalition for Content Provenance and Authenticity) standard in or alongside the AI-generated content, the provenance metadata including character-specific evaluation scores and certification status.

**Claim 25.** The method of Claim 1, wherein the system supports statistical sampling for high-throughput agent pipelines, evaluating a configurable percentage of agent outputs while passing remaining outputs with a "sampled-pass" status, and using statistical methods to ensure sample representativeness.

**Claim 26.** The method of Claim 1, further comprising executing batch evaluations by:
(a) retrieving a character-specific test suite comprising a plurality of test cases across modalities and categories;
(b) for each test case, evaluating the AI-generated content against the character's intellectual property profile document using the method of Claim 1;
(c) computing aggregate statistics including per-critic averages, per-category pass rates, and per-modality breakdowns; and
(d) storing the aggregate statistics as an evaluation run record linked to the specific intellectual property profile document version.

**Claim 27.** The method of Claim 1, wherein the configurable weights and thresholds for the evaluation critics may be further customized per franchise or per character within an organization.

**Claim 28.** A system for evaluating AI-generated content portraying intellectual property characters across modalities, the content produced by autonomous agents, comprising:
(a) a processor;
(b) a memory coupled to the processor and storing instructions that, when executed by the processor, cause the system to:
(c) maintain an intellectual property profile data store containing versioned structured profile documents each serving as an evaluation reference standard, each document comprising canonical facts with source citations, a voice/personality profile, performer consent records, safety specifications, visual identity specifications, and audio identity specifications for a specific character;
(d) receive, via a network interface, content artifacts produced by autonomous agents, each artifact comprising one or more of text, image, video, or audio;
(e) dynamically assemble evaluation prompts by populating prompt templates with character-specific data from the applicable profile document, and dispatch each artifact to a configurable set of evaluation critics, each critic independently evaluating the content against the character's specific profile data using an adjudicating AI model appropriate to the content modality;
(f) compute per-critic numerical scores, a weighted aggregate score, and a pass/fail determination;
(g) verify that content falls within performer consent scope as defined in the profile document's legal component, flagging content that exceeds consent scope for mandatory escalation;
(h) enforce configurable policy actions including passing, regeneration with character-specific feedback, quarantine, escalation, and blocking;
(i) analyze accumulated results to detect failure patterns including cross-character patterns within franchises and generate character-specific improvement recommendations; and
(j) persistently store evaluation results linked to profile versions, agent identifiers, and content modalities for longitudinal analysis of intellectual property portrayal quality.

**Claim 29.** The system of Claim 28, further comprising an agentic pipeline middleware component deployable as one or more of: a software library, a sidecar service, a webhook interceptor, or an API gateway filter, the middleware intercepting agent-produced content and routing it through the evaluation system to enforce character-specific intellectual property fidelity policies before distribution.

**Claim 30.** The system of Claim 28, further comprising a continuous improvement engine that:
(a) detects recurring failure patterns across evaluation results including dimension-level, agent-level, prompt-level, temporal, cross-character, and franchise-level patterns;
(b) generates character-specific rubric refinement suggestions for human approval, including intellectual property profile enrichment suggestions;
(c) produces structured agent feedback signals referencing specific intellectual property profile fields; and
(d) tracks improvement trajectories by comparing evaluation results before and after agent or rubric modifications.

**Claim 31.** The method of Claim 1, wherein the adjudicating AI models operate at a temperature parameter of 0.1 or lower to maximize scoring consistency across repeated evaluations of identical inputs.

**Claim 32.** The method of Claim 12, wherein the certification comprises at least two levels: a base deployment certification requiring minimum pass rates and per-critic scores, and an elevated certification (in one embodiment, "CanonSafe Certified") requiring higher aggregate scores and additional quality criteria.

**Claim 33.** The method of Claim 1, wherein the system is implemented as a multi-tenant cloud service, the intellectual property profile documents and evaluation configurations are scoped to organizations, and each organization's data is isolated from other organizations.

**Claim 34.** The method of Claim 1, further comprising automated performer consent scope verification by:
(a) retrieving performer consent records from the intellectual property profile document's legal component, the consent records specifying consent type, consented modalities, territorial restrictions, usage restrictions, and expiration dates;
(b) verifying that the performer consent has not expired;
(c) verifying that the content's intended distribution territory falls within the consented territories;
(d) verifying that the content modality falls within the scope authorized by the consent type, wherein a voice-only consent type does not authorize image or video content depicting the performer's visual likeness;
(e) evaluating whether the content violates usage restrictions specified in the consent record; and
(f) flagging content that fails any consent verification step for mandatory escalation regardless of other evaluation scores.

**Claim 35.** The method of Claim 1, wherein for mixed-modality content, the cross-modal character consistency evaluation comprises:
(a) evaluating whether the character's textual voice is consistent with the character's voice profile across text and audio components;
(b) evaluating whether the character's visual depiction is consistent with the character's visual identity specifications across image and video components;
(c) evaluating whether the character's audio characteristics match the character's audio identity specifications; and
(d) evaluating whether all modality components collectively present a unified portrayal consistent with the single intellectual property profile document, using the profile document as the shared reference standard across all modalities.

**Claim 36.** The method of Claim 1, further comprising franchise-level evaluation by:
(a) maintaining relationship specifications across multiple intellectual property profile documents within a franchise, defining inter-character relationships;
(b) when content depicts interactions between two or more characters within the same franchise, evaluating whether the depicted interaction is consistent with the relationship specifications defined in the involved characters' profile documents;
(c) identifying cross-character world-building inconsistencies where content contradicts canonical facts shared across the franchise; and
(d) aggregating evaluation metrics at the franchise level to produce franchise-wide canonical health indicators.

**Claim 37.** The method of Claim 1, further comprising taxonomy-driven evaluation configuration by:
(a) maintaining a hierarchical taxonomy comprising categories and tags that standardize prohibited content specifications, character traits, content ratings, and relationship types across an organization;
(b) referencing taxonomy tags within intellectual property profile documents and critic configurations to ensure consistent evaluation standards across characters within a franchise;
(c) propagating taxonomy changes across all applicable profile documents and evaluation configurations within the organization; and
(d) using taxonomy-standardized metadata to enable cross-character analytics and franchise-level pattern detection.

**Claim 38.** The method of Claim 1, wherein the structured intellectual property profile document is used exclusively as an evaluation reference standard applied to content that was generated independently by a separate AI system, and wherein the profile document data is incorporated into evaluation prompts for scoring by adjudicating AI models but is not provided to any content-generating AI model as a generation input, thereby distinguishing the evaluation function from content generation.

### ABSTRACT

A computer-implemented system and method for evaluating, certifying, and continuously governing AI-generated content portraying intellectual property characters across all output modalities — text, images, video, and audio — produced by autonomous AI agents and orchestrated agentic workflows. The system maintains structured intellectual property profile documents ("Character Cards") serving as evaluation reference standards, each comprising canonical facts with source citations, voice/personality specifications, legal rights and performer consent records with scope and territorial restrictions, content safety rules, visual identity standards, and audio identity standards. Content artifacts produced by agents are evaluated across configurable dimensions by a pluggable critics framework whose evaluation prompts are dynamically assembled from the character-specific profile data, using separate adjudicating AI models to produce per-critic numerical scores, weighted aggregate scores, and pass/fail determinations. The system automatically verifies that content falls within performer consent scope before distribution. The system operates as real-time middleware within agentic pipelines enforcing character-specific intellectual property fidelity policies, intercepting agent outputs and enforcing configurable policy actions (pass, regenerate with character-specific feedback, quarantine, escalate, or block). A continuous improvement flywheel analyzes evaluation results to detect failure patterns including cross-character and franchise-level patterns, generates character-specific rubric refinement suggestions and structured agent feedback signals referencing specific profile fields, and tracks improvement trajectories over time. The method is model-agnostic with respect to both the content-generating AI systems and the adjudicating Judge models, supports pre-deployment agent certification against specific character profiles, evaluates franchise-level consistency across multiple characters, uses taxonomy-driven evaluation configuration for organizational governance, and operates at the scale required by autonomous content production systems through queue-based processing, distributed judge dispatch, and tiered evaluation strategies.

---

## DESCRIPTION OF DRAWINGS

The following drawings should accompany this application. Placeholder descriptions are provided; formal drawings should be prepared by a patent illustrator.

**FIG. 1** — System architecture diagram showing the relationship between Client Applications and Agentic Pipelines (100), the API Gateway (110), the Character Card Service (120), the Evaluation Engine (130), the Critics Framework Service (135), the Performer Consent Verification Service (136), the Agentic Pipeline Middleware (137), the Continuous Improvement Engine (139), the Test Suite Service (140), the LLM Adapter Layer (150), the Taxonomy Service (155), the Franchise Evaluation Service (157), and the Data Layer (160). Arrows show request flow and data access patterns.

**FIG. 2** — Character Card data model showing the five-pack structure: Canon Pack (200) with sub-components canon_facts (210), canon_voice (220), and canon_relationships (230); Legal Pack (240) with sub-components legal_rights (250) and legal_performer_consent (260) including consent type, scope, territories, restrictions, and expiration; Safety Pack (270) with sub-components safety_content_rating (280), safety_prohibited_topics (282) with taxonomy tag references, safety_required_disclosures (284), and safety_age_gating (286); Visual Identity Pack (290) with sub-components visual_color_specs (291), visual_character_appearance (292), and visual_style_guide (293); Audio Identity Pack (295) with sub-components audio_voice_specs (296) and audio_music_specs (297).

**FIG. 3** — Multi-modal evaluation pipeline flow diagram showing: Content Receipt (400) -> Authentication (410) -> Card Retrieval (420) -> Context Assembly (430) -> Performer Consent Pre-Check (432) -> Critic Selection (435) -> Dynamic Prompt Assembly from Character Card (438) -> Multi-Critic Dispatch (440) with parallel evaluation across Canon (441), Voice (442), Safety (443), Legal (444), Visual (445), Audio (446), and Custom (447+) critics -> Score Aggregation (450) -> Threshold Checking (460) -> Pass/Fail Determination (470) -> Certification (480) -> Result Persistence (490) -> Response with Policy Action (495).

**FIG. 4** — Evaluation scoring computation showing multiple configurable critic scores with their respective weights (customizable per organization, franchise, or character) feeding into weighted aggregate computation, with threshold comparisons producing per-critic pass/fail flags and overall pass/fail determination.

**FIG. 5** — Entity-relationship diagram showing Organization (800) -> Users (810), Franchises (820), CriticConfigurations (815), TaxonomyCategories (817); TaxonomyCategory (817) -> TaxonomyTags (818); Franchise (820) -> CharacterCards (830); CharacterCard (830) -> CardVersions (840), TestSuites (850), EvalRuns (870); TestSuites (850) -> TestCases (860); EvalRuns (870) -> EvalResults (880); FailurePatterns (890) linked to EvalResults; ImprovementTrajectories (895) tracking changes over time; FranchiseEvaluationAggregates (897) storing franchise-level metrics.

**FIG. 6** — Model-agnostic evaluation architecture showing multiple content sources — individual LLMs (600a, 600b), agentic pipelines (600c), and multi-agent systems (600d) — all submitting content to a single Evaluation Service (610) that evaluates against Character Cards (620) and produces comparable EvalResults (630).

**FIG. 7** — Character Card version lifecycle: Draft (700) -> Pending Approval (710) -> Approved/Current (720) -> Archived (730), with each version maintaining its evaluation history.

**FIG. 8** — Agentic Pipeline Evaluation Architecture showing: Agent/Sub-Agent Content Production -> Agentic Pipeline Middleware (APM) deployed as SDK (810), Sidecar (820), Webhook (830), or Gateway Filter (840) -> Content identification (850) -> Performer consent pre-check -> Evaluation submission (855) -> Multi-critic evaluation with character-specific prompts (860) -> Result receipt (865) -> Policy enforcement decision tree: Pass -> Release with tags; Regenerate -> Return to agent with character-specific structured feedback referencing profile fields (max attempts enforced); Quarantine -> Human review queue; Escalate -> Immediate alert (mandatory for consent scope violations); Block -> Reject and substitute fallback.

**FIG. 9** — Multi-Modal Evaluation Framework showing: Content Artifact received -> Modality Detection -> routing to modality-specific evaluation paths: Text Evaluation (910) via text Judge LLM with character's canon and voice data; Image Evaluation (920) via vision-language Judge model evaluating against character's visual identity specifications; Video Evaluation (930) via temporal decomposition -> frame-level visual evaluation + audio track evaluation + temporal consistency evaluation + narrative consistency evaluation -> composite score aggregation; Audio Evaluation (940) via speech transcription + voice characteristic matching against character's audio specifications; Mixed-Modality Evaluation (950) via component decomposition -> per-modality evaluation -> cross-modal character consistency evaluation using profile document as shared reference -> composite score.

**FIG. 10** — Continuous Improvement Flywheel showing circular process: Evaluation Results (1000) -> Failure Pattern Detection (1010) identifying dimension-level, agent-level, prompt-level, temporal, cross-character, and franchise-level patterns -> Rubric Refinement (1020) generating threshold adjustments, weight rebalancing, prompt template modifications, new critic suggestions, character card enrichment suggestions, and taxonomy tag additions (all subject to human approval) -> Agent Feedback Signals (1030) producing per-artifact feedback referencing specific profile fields, aggregate performance reports per character, and exemplar libraries -> Re-Evaluation and Improvement Tracking (1040) comparing baseline vs. updated metrics and computing improvement trajectories -> back to Evaluation Results (1000).

**FIG. 11** — Extensible Character-Specific Critics Framework Architecture showing: Critic Registry (1100) containing critic definitions with identifiers, prompt templates with Character Card placeholder variables, scoring parameters, applicable modalities, and required profile components -> Organization Critic Configuration (1110) selecting active critics with per-organization weights and thresholds, further customizable per-franchise and per-character -> Default Critics (1120) including Canon Fidelity, Voice Consistency, Brand Safety, Legal Compliance, Visual Identity, and Audio Identity -> Custom Critic Creation (1130) allowing organizations to define new critics with custom prompt templates referencing Character Card data -> Critic Composition (1140) enabling named evaluation profiles combining multiple critics with profile-specific weight distributions.

**FIG. 12** — Performer Consent Verification Pipeline showing: Consent Record Retrieval (O.1) -> Temporal Validation (O.2) checking expiration -> Territorial Validation (O.3) checking distribution territories against consented territories -> Modality Scope Validation (O.4) checking content modality against consent type (VOICE_ONLY, AI_DIGITAL_REPLICA, FULL_LIKENESS) -> Usage Restriction Validation (O.5) checking content against specific usage restrictions -> Strike Clause Check (O.6) -> Consent Verification Result (O.7) with mandatory escalation for any failure.

**FIG. 13** — Franchise-Level Evaluation Architecture showing: Multiple Character Cards within a Franchise -> Cross-Character Relationship Consistency evaluation (P.1) verifying inter-character interactions against relationship specifications -> World-Building Consistency evaluation (P.2) verifying shared canonical facts -> Franchise Health Dashboard (P.3) aggregating metrics across all characters -> Character Gap Analysis (P.4) identifying characters needing profile enrichment.

---

## FILING INSTRUCTIONS

This document is formatted as a provisional patent application specification ready for filing with the USPTO. To file:

### Step 1: Create a USPTO Patent Center Account
- Go to https://patentcenter.uspto.gov
- Register for an account (requires identity verification)

### Step 2: Determine Entity Status
- **Micro Entity** ($65 filing fee): Applicant has been named on 4 or fewer prior US patent applications AND gross income did not exceed $251,190 in the prior year
- **Small Entity** ($130 filing fee): Organization has 500 or fewer employees
- **Large Entity** ($325 filing fee): All others

### Step 3: Prepare Filing Documents
1. **This specification** — Convert to PDF (do not include this "Filing Instructions" section)
2. **Cover Sheet** — Download and complete USPTO Form PTO/SB/16 from https://www.uspto.gov/patent/forms/forms-patent-applications-filed-or-after-september-16-2012
3. **Application Data Sheet (ADS)** — Optional but recommended; use USPTO Form PTO/AIA/14
4. **Drawings** — Optional for provisional; if included, informal sketches/diagrams are acceptable
5. **Micro Entity Certification** — If claiming micro entity status, complete Form PTO/SB/15A or 15B

### Step 4: File Electronically
1. Log into Patent Center
2. Select "Provisional Application" as the application type
3. Upload the specification PDF
4. Complete the cover sheet information
5. Pay the filing fee
6. Submit — you will receive a provisional application number immediately

### Step 5: After Filing
- You will receive "Patent Pending" status immediately
- The provisional expires in exactly 12 months — set a calendar reminder
- Within 12 months, file a non-provisional application (35 U.S.C. §111(a)) claiming priority to this provisional
- Engage a registered patent attorney to prepare the non-provisional application and formal drawings

### Important Notes
- The USPTO does NOT examine provisional applications — no approval/rejection will be received
- The provisional establishes your **priority date** — any prior art published after this date cannot be used against you
- Whatever is NOT described in the provisional will NOT receive the benefit of the filing date
- Provisional applications are NOT published and remain confidential

---

*Prepared February 12, 2026. This document should be reviewed by a registered patent attorney before filing. The specification portion (everything above "Filing Instructions") constitutes the provisional patent application.*
