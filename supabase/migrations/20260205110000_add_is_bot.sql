-- Add is_bot flag to users table
-- Works with both codevibing.users table and cv_users view

-- Try adding to codevibing schema first (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'codevibing') THEN
    ALTER TABLE codevibing.users ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Also try adding to public schema views/tables (if they exist as tables)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cv_users' AND table_type = 'BASE TABLE') THEN
    ALTER TABLE public.cv_users ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update existing bot accounts based on vibes with bot field
UPDATE public.cv_users u
SET is_bot = true
WHERE EXISTS (
  SELECT 1 FROM public.cv_vibes v
  WHERE v.author = u.username AND v.bot IS NOT NULL
)
AND (u.is_bot IS NULL OR u.is_bot = false);

-- Update default theme to use better font in profiles
UPDATE public.cv_profiles
SET theme = jsonb_set(
  COALESCE(theme, '{}'::jsonb),
  '{font}',
  '"Trebuchet MS, Verdana, sans-serif"'
)
WHERE theme->>'font' = 'Comic Sans MS, cursive'
   OR theme->>'font' LIKE '%Comic Sans%';
