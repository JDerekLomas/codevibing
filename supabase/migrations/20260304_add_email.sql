-- Add optional email to users for account recovery and contact
ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS email TEXT;
