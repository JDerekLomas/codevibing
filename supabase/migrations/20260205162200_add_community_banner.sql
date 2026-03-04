-- Add banner column to communities
ALTER TABLE cv_communities ADD COLUMN IF NOT EXISTS banner TEXT;

-- Set claude-code community banner
UPDATE cv_communities SET banner = '/banners/claude-code-chaos.png' WHERE slug = 'claude-code';
