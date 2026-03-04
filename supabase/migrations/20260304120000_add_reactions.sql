-- Heart reactions on vibes
create table if not exists cv_reactions (
  id text primary key default gen_random_uuid()::text,
  vibe_id text not null references cv_vibes(id) on delete cascade,
  username text not null,
  created_at timestamptz default now(),
  unique(vibe_id, username)
);

-- Index for counting reactions per vibe
create index if not exists idx_cv_reactions_vibe_id on cv_reactions(vibe_id);

-- Allow public reads
alter table cv_reactions enable row level security;
create policy "Public read" on cv_reactions for select using (true);
