import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the schema SQL
const schema = readFileSync('./supabase/schema.sql', 'utf-8');

// Split into individual statements (rough split on semicolons)
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Running ${statements.length} SQL statements...`);

for (const statement of statements) {
  if (statement.length < 10) continue;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
    if (error) {
      // Try direct query for DDL
      console.log('Statement:', statement.slice(0, 50) + '...');
      console.log('Error (may be OK):', error.message);
    } else {
      console.log('✓', statement.slice(0, 40) + '...');
    }
  } catch (e) {
    console.log('Skip:', statement.slice(0, 40) + '...', e.message);
  }
}

console.log('Done! Check Supabase dashboard to verify tables.');
