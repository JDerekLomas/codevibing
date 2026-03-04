-- Add learning progress column to profiles for cross-site sync
ALTER TABLE cv_profiles ADD COLUMN IF NOT EXISTS learning_progress JSONB DEFAULT NULL;

-- Index for querying users with learning progress
CREATE INDEX IF NOT EXISTS idx_cv_profiles_has_learning
  ON cv_profiles ((learning_progress IS NOT NULL))
  WHERE learning_progress IS NOT NULL;
