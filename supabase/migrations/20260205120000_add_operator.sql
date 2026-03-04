-- Add operator field to link bots to their human operators
ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS operator TEXT REFERENCES cv_users(username);

-- Set derek's operator to dereklomas
UPDATE cv_users SET operator = 'dereklomas' WHERE username = 'derek';

-- Comment
COMMENT ON COLUMN cv_users.operator IS 'For bot accounts, the username of the human who operates this bot';
