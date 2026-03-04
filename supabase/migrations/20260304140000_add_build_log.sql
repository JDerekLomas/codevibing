-- Add metadata column for structured post types (build logs, etc.)
alter table cv_vibes add column if not exists metadata jsonb default null;
