-- Add friend_type to friendships (human or bot)
ALTER TABLE cv_friendships ADD COLUMN IF NOT EXISTS friend_type TEXT DEFAULT 'human' CHECK (friend_type IN ('human', 'bot'));

-- Add is_bot flag to users
ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;

-- Mark auto-created users as bots
UPDATE cv_users SET is_bot = true WHERE auto_created = true;
