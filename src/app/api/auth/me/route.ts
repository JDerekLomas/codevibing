import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';
import { supabaseAdmin, verifyApiKey } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  // Check for API key auth first (Bearer token)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const apiKey = authHeader.slice(7);
    const username = await verifyApiKey(apiKey);

    if (username) {
      // Get user details
      const { data: cvUser } = await supabaseAdmin
        .from('cv_users')
        .select('username, auto_created')
        .eq('username', username)
        .single();

      return NextResponse.json({
        username: cvUser?.username,
        isBot: cvUser?.auto_created || false,
      });
    }

    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // Fall back to GitHub OAuth
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  // Get linked cv_user
  const { data: cvUser } = await supabaseAdmin
    .from('cv_users')
    .select('username, github_username, auto_created')
    .eq('github_id', user.id)
    .single();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      github_username: user.user_metadata?.user_name,
      avatar: user.user_metadata?.avatar_url,
      cv_username: cvUser?.username || null,
    },
    // Also include these for consistency with API key auth
    username: cvUser?.username || null,
    isBot: cvUser?.auto_created || false,
  });
}
