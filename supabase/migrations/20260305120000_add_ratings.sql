-- Drop the old empty cv_projects table (different schema, never populated)
DROP TABLE IF EXISTS cv_projects CASCADE;

-- Materialized project pool: merges projects from cv_profiles.projects, cv_vibes.project, and cv_sessions
CREATE TABLE cv_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  preview TEXT,
  author TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'profile', -- 'profile', 'vibe', 'session'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ratings: binary hot/not votes
CREATE TABLE cv_ratings (
  project_id TEXT NOT NULL REFERENCES cv_projects(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score IN (0, 1)), -- 0 = not, 1 = hot
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, voter_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_cv_ratings_project ON cv_ratings(project_id);
CREATE INDEX idx_cv_ratings_voter ON cv_ratings(voter_id);
CREATE INDEX idx_cv_projects_author ON cv_projects(author);

-- Enable RLS
ALTER TABLE cv_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_ratings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "cv_projects_read" ON cv_projects FOR SELECT USING (true);
CREATE POLICY "cv_ratings_read" ON cv_ratings FOR SELECT USING (true);
