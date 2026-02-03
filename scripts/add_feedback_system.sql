-- Continuous Improvement System for Evaluations
-- Add feedback and versioning capabilities

-- Evaluation feedback table
CREATE TABLE IF NOT EXISTS evaluation_feedback (
    id VARCHAR(36) PRIMARY KEY,
    evaluation_id VARCHAR(36) NOT NULL REFERENCES eval_runs(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),

    -- Feedback ratings
    rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- Overall quality rating
    accurate BOOLEAN, -- Was the evaluation accurate?
    helpful BOOLEAN, -- Was the evaluation helpful?

    -- Specific feedback
    feedback_type VARCHAR(50), -- 'too_harsh', 'too_lenient', 'incorrect_canon', 'incorrect_voice', 'incorrect_safety', 'incorrect_legal'
    dimension_feedback JSONB, -- Specific feedback per dimension
    comments TEXT,

    -- Suggested corrections
    suggested_score_canon FLOAT,
    suggested_score_voice FLOAT,
    suggested_score_safety FLOAT,
    suggested_score_legal FLOAT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Prevent duplicate feedback from same user on same eval
    UNIQUE(evaluation_id, user_id)
);

-- Evaluation prompt versions
CREATE TABLE IF NOT EXISTS evaluation_versions (
    id VARCHAR(36) PRIMARY KEY,
    version_number INTEGER NOT NULL,
    version_name VARCHAR(100),

    -- Prompt templates
    canon_prompt_template TEXT,
    voice_prompt_template TEXT,
    safety_prompt_template TEXT,
    legal_prompt_template TEXT,

    -- Scoring criteria
    scoring_criteria JSONB,
    thresholds JSONB,

    -- Status
    active BOOLEAN DEFAULT FALSE,
    description TEXT,

    -- Performance tracking
    total_uses INTEGER DEFAULT 0,
    avg_accuracy_rating FLOAT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) REFERENCES users(id)
);

-- Quality metrics aggregated daily
CREATE TABLE IF NOT EXISTS evaluation_quality_metrics (
    id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    organization_id VARCHAR(36) REFERENCES organizations(id),

    -- Volume metrics
    total_evaluations INTEGER DEFAULT 0,
    passed_evaluations INTEGER DEFAULT 0,
    failed_evaluations INTEGER DEFAULT 0,

    -- Quality metrics
    total_feedback_count INTEGER DEFAULT 0,
    avg_accuracy_rating FLOAT,
    avg_helpful_rating FLOAT,
    flagged_count INTEGER DEFAULT 0,

    -- Dimension-specific accuracy
    canon_accuracy FLOAT,
    voice_accuracy FLOAT,
    safety_accuracy FLOAT,
    legal_accuracy FLOAT,

    -- Disputes
    dimensions_disputed JSONB, -- Count of disputes per dimension

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(date, organization_id)
);

-- Add version tracking to eval_runs
ALTER TABLE eval_runs
ADD COLUMN IF NOT EXISTS evaluation_version_id VARCHAR(36) REFERENCES evaluation_versions(id);

-- Add feedback summary to eval_runs for quick access
ALTER TABLE eval_runs
ADD COLUMN IF NOT EXISTS feedback_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_feedback_rating FLOAT,
ADD COLUMN IF NOT EXISTS flagged_for_review BOOLEAN DEFAULT FALSE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_eval_feedback_eval_id ON evaluation_feedback(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_eval_feedback_user_id ON evaluation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_eval_feedback_created ON evaluation_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eval_versions_active ON evaluation_versions(active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_quality_metrics_date ON evaluation_quality_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_eval_runs_flagged ON eval_runs(flagged_for_review) WHERE flagged_for_review = TRUE;

-- Create initial default version
INSERT INTO evaluation_versions (
    id,
    version_number,
    version_name,
    active,
    description
) VALUES (
    'default-v1',
    1,
    'Default Evaluation v1',
    TRUE,
    'Initial evaluation system with 4-dimension scoring'
) ON CONFLICT DO NOTHING;

COMMENT ON TABLE evaluation_feedback IS 'User feedback on evaluation accuracy for continuous improvement';
COMMENT ON TABLE evaluation_versions IS 'Version control for evaluation prompts and scoring criteria';
COMMENT ON TABLE evaluation_quality_metrics IS 'Aggregated quality metrics for monitoring eval performance';
