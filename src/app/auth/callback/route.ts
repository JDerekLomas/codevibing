import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-auth';
import { supabaseAdmin, upsertProfile, generateApiKey, hashToken } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Get GitHub user info
      const githubUsername = data.user.user_metadata?.user_name ||
                            data.user.user_metadata?.preferred_username ||
                            data.user.email?.split('@')[0] ||
                            `user_${data.user.id.slice(0, 8)}`;

      const displayName = data.user.user_metadata?.full_name ||
                         data.user.user_metadata?.name ||
                         githubUsername;

      const avatar = data.user.user_metadata?.avatar_url || null;

      // Check if this GitHub user is already linked to a cv_user
      const { data: existingLink } = await supabaseAdmin
        .from('cv_users')
        .select('username')
        .eq('github_id', data.user.id)
        .single();

      if (existingLink) {
        // Already linked - update profile with latest GitHub info
        await upsertProfile({
          username: existingLink.username,
          avatar: avatar,
          display_name: displayName,
        });

        return NextResponse.redirect(`${origin}/u/${existingLink.username}`);
      }

      // Check if username is available
      let username = githubUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const { data: existingUser } = await supabaseAdmin
        .from('cv_users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        // Username taken - append random suffix
        username = `${username}_${Math.random().toString(36).slice(2, 6)}`;
      }

      // Create new cv_user linked to GitHub
      const apiKey = generateApiKey();
      const tokenHash = hashToken(apiKey);

      await supabaseAdmin
        .from('cv_users')
        .insert({
          username,
          token_hash: tokenHash,
          auto_created: false,
          github_id: data.user.id,
          github_username: githubUsername,
        });

      // Create profile with GitHub info
      await upsertProfile({
        username,
        display_name: displayName,
        bio: data.user.user_metadata?.bio || '',
        avatar: avatar,
        bot_name: 'Claude',
        bot_personality: '',
        mood: 'vibing',
        theme: {
          primary: '#3b82f6',
          secondary: '#1e293b',
          text: '#f8fafc',
          accent: '#22c55e',
          font: 'Inter, system-ui, sans-serif',
        },
        links: [],
        projects: [],
        blinkies: [],
        profile_views: 0,
      });

      // Redirect to profile with API key in hash (one-time display)
      return NextResponse.redirect(
        `${origin}/u/${username}?welcome=true&key=${apiKey}`
      );
    }
  }

  // OAuth error - redirect to home with error
  return NextResponse.redirect(`${origin}?error=auth_failed`);
}
