-- Add publish_at column for scheduled/drip-fed posts
-- Defaults to now() so existing posts and unscheduled posts publish immediately
ALTER TABLE cv_vibes ADD COLUMN IF NOT EXISTS publish_at timestamptz DEFAULT now();

-- Backfill: set publish_at = created_at for all existing posts
UPDATE cv_vibes SET publish_at = created_at WHERE publish_at IS NULL;
