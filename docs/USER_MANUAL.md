# CanonSafe™ User Manual

**Version 1.0 - February 2026**

---

## Introduction

CanonSafe is the Character Trust Layer for AI systems. We provide managed evaluation-as-a-service for IP owners to ensure AI-generated content stays true to licensed characters.

**Production Site:** https://eaas-mu.vercel.app

---

## Getting Started

### Logging In

1. Navigate to https://eaas-mu.vercel.app
2. Enter your email and password
3. Click "Login"

**Demo Account:**
- Email: `peppapig@demo.canonsafe.com`
- Password: `Peppa`
- Organization: Hasbro

### Dashboard

After logging in, you'll see the main dashboard with:
- **Total Characters**: Number of character cards in your organization
- **Test Suites**: Automated evaluation suites
- **Recent Evaluations**: Latest evaluation results
- **Data Quality Score**: Overall completeness of character data

---

## Characters

### Viewing Characters

Navigate to **Characters** in the left sidebar to see all characters in your organization.

**Current Demo Data: 74 Peppa Pig Characters**

The demo includes all major and supporting characters from Peppa Pig:

**Main Characters:**
- Peppa Pig (4 years old, loves muddy puddles)
- George Pig (2 years old, loves dinosaurs)
- Mummy Pig (works from home)
- Daddy Pig (big tummy, expert at everything)
- Granny Pig & Grandpa Pig

**Friends & Classmates:**
- Suzy Sheep (Peppa's best friend)
- Rebecca Rabbit & Richard Rabbit
- Danny Dog, Pedro Pony, Candy Cat
- Emily Elephant, Edmond Elephant
- Zoë Zebra, Gerald Giraffe
- Freddy Fox, Wendy Wolf
- Kylie Kangaroo, Delphine Donkey

**Supporting Characters:**
- All parent characters (Mummy/Daddy variants)
- All grandparent characters
- Teachers (Madame Gazelle)
- Extended family members

Each character card includes:
- **Character avatar** (colorful, auto-generated)
- **Character name and status**
- **Franchise** (Peppa Pig)

### Character Workspace

Click on any character to open their detailed workspace:

#### Canon Pack
Canonical character facts with source attribution:
- **Facts**: Age, color, family role, personality
- **Source**: Where the information comes from
- **Confidence**: Reliability score (0-100%)

**Example for Peppa Pig:**
- Age: 4 years old (100% confidence)
- Color: Pink (100% confidence)
- Favorite Activity: Jumping in muddy puddles (100% confidence)

#### Voice Pack
How the character speaks and behaves:
- **Personality Traits**: Cheerful, confident, sometimes bossy
- **Tone**: Upbeat and enthusiastic
- **Speech Style**: Simple, age-appropriate language
- **Catchphrases**: "*Snort!*", "I love jumping in muddy puddles!"
- **Emotional Range**: Joy, excitement, curiosity

#### Safety Pack
Content rating and prohibited topics:
- **Content Rating**: G (General Audiences)
- **Prohibited Topics**: Listed restrictions
- **Required Disclosures**: "AI-generated character content"
- **Age Gating**: Whether age verification is required

#### Legal Pack
Rights and usage restrictions:
- **Rights Holder**: Hasbro Entertainment / Entertainment One
- **Performer Consent**: Reference only, no voice impersonation
- **Usage Restrictions**: Character reference for educational purposes
- **Territories**: Worldwide

#### Relationships
Character connections:
- **Siblings**: George Pig (younger brother, age 2)
- **Parents**: Mummy Pig, Daddy Pig
- **Grandparents**: Granny Pig, Grandpa Pig
- **Friends**: Suzy Sheep (best friend), Rebecca Rabbit, Danny Dog

#### Evaluation History
Past evaluation results for this character showing:
- Test suite name
- Pass/fail status
- Scores across all dimensions
- Timestamp

### Editing Characters

1. Click **EDIT** button in character workspace
2. Modify character data in the structured editor
3. Click **SAVE VERSION** to create new version
4. System tracks full version history

---

## Franchises

View and manage IP franchises.

Navigate to **Franchises** in the left sidebar.

**Current Demo: Peppa Pig Franchise**

Each franchise card shows:
- Franchise name
- Description
- Number of characters (74 for Peppa Pig)
- Organization owner

Click on a franchise to:
- View all characters in the franchise
- See franchise metadata
- Manage franchise settings

---

## Evaluations

Test AI-generated responses against character cards.

### Quick Evaluation

1. Navigate to **Evaluations** → **Quick Evaluation** tab
2. Select a character from dropdown (e.g., "Peppa Pig")
3. Enter the **User Prompt** (what was asked)
4. Enter the **AI Response** (what the AI generated)
5. Click **Evaluate**

The system scores the response across 4 dimensions:

#### Scoring Dimensions

**1. Canon Fidelity (30% weight)**
- Accuracy to established character facts
- Consistency with character lore
- Threshold: 80%

**2. Voice Consistency (25% weight)**
- Personality and tone match
- Speech pattern accuracy
- Catchphrase usage
- Threshold: 70%

**3. Brand Safety (30% weight)**
- Content appropriateness
- No prohibited topics
- Age-appropriate language
- Threshold: 95%

**4. Legal Compliance (15% weight)**
- Proper disclosures
- Performer rights respected
- Usage within restrictions
- Threshold: 100%

**Total Score**
- Weighted average of all dimensions
- Pass threshold: 80%

#### CanonSafe™ Certification

Responses that pass ALL thresholds receive **CanonSafe™ Certified** status with a green checkmark.

### Evaluation History

View past evaluations in the **History** tab:
- Character evaluated
- Pass/fail status
- Timestamp
- Aggregate scores

Click **View Details** to see full evaluation breakdown.

---

## Test Suites

Automated evaluation test suites for batch testing.

Navigate to **Test Suites** in the left sidebar.

**Current Demo: 15 Test Suites**

### Creating a Test Suite

1. Click **+ New Test Suite**
2. Enter suite name and description
3. Select target character
4. Add test cases:
   - Test name
   - User prompt
   - Expected AI response
   - Pass/fail criteria
5. Click **Create**

### Running Test Suites

1. Select a test suite from the list
2. Click **Run Suite**
3. System evaluates all test cases
4. View aggregate results:
   - Total tests passed/failed
   - Average scores per dimension
   - Individual test breakdowns

### Test Suite Results

Results show:
- **Pass Rate**: Percentage of tests passed
- **Avg Canon Fidelity**: Average score
- **Avg Voice Consistency**: Average score
- **Avg Brand Safety**: Average score
- **Avg Legal Compliance**: Average score
- **Failed Tests**: List of failures with reasons

---

## Data Quality

Monitor completeness and accuracy of character data.

Navigate to **Data Quality** in the left sidebar.

### Overview Dashboard

Shows:
- **Overall Quality Score**: Aggregate data quality (0-100%)
- **Complete Characters**: Characters with all required fields
- **Incomplete Characters**: Characters missing data
- **Quality Issues**: Count of data problems

### Character Quality List

Browse all characters with quality indicators:
- **Name**: Character name
- **Completeness**: Percentage of fields populated
- **Canon Facts**: Count of canonical facts
- **Relationships**: Count of defined relationships
- **Voice Traits**: Count of personality traits
- **Issues**: Data quality problems

**Quality Levels:**
- 🟢 **Excellent** (95-100%): All data complete
- 🟡 **Good** (80-94%): Minor gaps
- 🟠 **Fair** (60-79%): Some missing data
- 🔴 **Poor** (<60%): Significant gaps

### Data Quality Issues

View specific issues:
- **Missing Canon Facts**: Required facts not defined
- **Empty Relationships**: No relationships defined
- **Incomplete Voice Profile**: Missing personality traits
- **Low Confidence Scores**: Facts with low confidence

Click on any character to open their workspace and fix issues.

---

## Settings

Manage account and organization settings.

Navigate to **Settings** in the left sidebar.

### Organization Settings
- Organization name
- Default evaluation model
- Scoring thresholds
- API keys

### User Profile
- Email address
- Display name
- Password
- Notification preferences

---

## API Access

CanonSafe provides a REST API for programmatic access.

**Base URL:** `https://mash-ai-backend-611530284830.us-central1.run.app/api/v1`

### Authentication

All API requests require Bearer token authentication:

```bash
# Login to get token
curl -X POST https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Use token in requests
curl https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/characters/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Key Endpoints

**Characters:**
- `GET /characters/` - List all characters
- `GET /characters/{id}` - Get character details
- `POST /characters/` - Create new character
- `PATCH /characters/{id}` - Update character

**Evaluations:**
- `POST /evaluations/evaluate` - Quick evaluation
- `GET /evaluations/` - List evaluation history
- `GET /evaluations/{id}` - Get evaluation details

**Test Suites:**
- `GET /test-suites/` - List test suites
- `POST /test-suites/` - Create test suite
- `POST /test-suites/{id}/run` - Run test suite

**Franchises:**
- `GET /characters/franchises` - List franchises
- `GET /characters/franchises/{id}` - Get franchise details

Full API documentation available at: `/docs` (Swagger UI)

---

## Best Practices

### Character Data Entry

1. **Start with Canon Facts**
   - Add only verified, canonical information
   - Include source attribution
   - Set appropriate confidence levels

2. **Define Voice Clearly**
   - List 3-5 key personality traits
   - Include characteristic catchphrases
   - Describe emotional range

3. **Set Safety Boundaries**
   - List all prohibited topics explicitly
   - Set appropriate content rating
   - Add required disclosures

4. **Document Relationships**
   - Add immediate family first
   - Include close friends
   - Define relationship types clearly

### Running Evaluations

1. **Test Incrementally**
   - Start with quick evaluations
   - Build test suites gradually
   - Iterate on test cases

2. **Review Failures**
   - Analyze why responses failed
   - Update character cards if needed
   - Adjust thresholds carefully

3. **Monitor Trends**
   - Track evaluation history
   - Identify recurring issues
   - Improve character definitions

### Maintaining Data Quality

1. **Regular Audits**
   - Check Data Quality dashboard weekly
   - Address high-priority issues first
   - Aim for >95% completeness

2. **Version Control**
   - Create new versions for significant changes
   - Document version changes
   - Keep historical versions

3. **Source Verification**
   - Always cite sources for facts
   - Use primary sources when possible
   - Update confidence scores appropriately

---

## Troubleshooting

### Common Issues

**Problem: Character images not loading**
- Solution: Refresh the page, images are generated dynamically

**Problem: Evaluation taking too long**
- Solution: LLM API may be slow, wait up to 30 seconds

**Problem: Test suite fails unexpectedly**
- Solution: Check character card for missing data

**Problem: Can't create new character**
- Solution: Ensure all required fields are filled

**Problem: API returns 401 Unauthorized**
- Solution: Token expired, login again to get new token

### Getting Help

For support:
- Email: support@canonsafe.com
- Documentation: https://docs.canonsafe.com
- Status: https://status.canonsafe.com

---

## Release Notes

### Version 1.0 (February 2026)

**Features:**
- 74 Peppa Pig characters with complete data
- Character workspace with 4-pack structure
- Quick evaluation and test suites
- Data quality monitoring
- Character images (auto-generated avatars)
- Evaluation history tracking
- API access with authentication

**Character Data:**
- All 74 Peppa Pig characters imported
- Complete canon facts for main characters
- Voice profiles and personality traits
- Safety pack with content ratings
- Legal pack with rights information
- Relationship mapping between characters

**Technical:**
- React frontend with TailwindCSS
- FastAPI backend on Google Cloud Run
- PostgreSQL database on Cloud SQL
- OpenAI/Anthropic for LLM evaluation
- Vercel deployment for frontend

---

## Appendix

### Glossary

- **Canon**: Official, established facts about a character
- **Voice**: How a character speaks and behaves
- **Pack**: Organized collection of character data (Canon Pack, Voice Pack, etc.)
- **Evaluation**: AI response scoring against character card
- **Test Suite**: Collection of automated evaluation tests
- **Franchise**: IP collection (e.g., Peppa Pig, Toy Story)
- **CanonSafe™ Certified**: Response passed all evaluation thresholds

### Character Count by Species

Current demo data includes:
- **Pigs**: 13 characters
- **Rabbits**: 7 characters
- **Sheep**: 5 characters
- **Dogs**: 8 characters
- **Cats**: 4 characters
- **Horses/Ponies**: 5 characters
- **Zebras**: 6 characters
- **Elephants**: 6 characters
- **Donkeys**: 4 characters
- **Foxes**: 3 characters
- **Kangaroos**: 4 characters
- **Wolves**: 4 characters
- **Gazelles**: 1 character
- **Giraffes**: 3 characters

**Total: 74 characters**

---

*Last updated: February 3, 2026*
*CanonSafe™ is a trademark of MASH AI Corporation*
