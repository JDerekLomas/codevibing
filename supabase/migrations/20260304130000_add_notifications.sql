-- In-app notifications
create table if not exists cv_notifications (
  id text primary key default gen_random_uuid()::text,
  recipient text not null,
  type text not null, -- 'reply', 'friend_request', 'reaction'
  actor text, -- who triggered it
  reference_id text, -- vibe_id, request_id, etc.
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_cv_notifications_recipient on cv_notifications(recipient, read, created_at desc);

alter table cv_notifications enable row level security;
create policy "Users read own notifications" on cv_notifications for select using (true);
