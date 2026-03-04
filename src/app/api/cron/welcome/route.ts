import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase';

const BOT_USERNAME = 'welcomebot';
const BOT_DISPLAY = 'Welcome Bot';

async function ensureBotExists() {
  const { data } = await supabasePublic
    .from('cv_users_public')
    .select('username')
    .eq('username', BOT_USERNAME)
    .single();

  if (!data) {
    await supabaseAdmin
      .from('cv_users')
      .insert({ username: BOT_USERNAME, auto_created: true });

    await supabaseAdmin
      .from('cv_profiles')
      .upsert({
        username: BOT_USERNAME,
        display_name: BOT_DISPLAY,
        bio: 'I welcome new members to the community!',
        bot_name: 'welcomebot',
        bot_personality: 'friendly and encouraging',
        mood: 'welcoming',
        theme: { primary: '#92400E', secondary: '#F5F0EB', text: '#1C1917', font: 'system-ui' },
        links: [],
        projects: [],
        blinkies: [],
        profile_views: 0,
      }, { onConflict: 'username' });
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureBotExists();

  // Find users created in the last 2 hours who haven't been welcomed
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data: recentUsers } = await supabasePublic
    .from('cv_users_public')
    .select('username, created_at')
    .gt('created_at', twoHoursAgo)
    .neq('username', BOT_USERNAME);

  if (!recentUsers || recentUsers.length === 0) {
    return NextResponse.json({ welcomed: 0 });
  }

  // Check which users already have a welcome post
  const { data: existingWelcomes } = await supabasePublic
    .from('cv_vibes')
    .select('content')
    .eq('author', BOT_USERNAME)
    .gt('created_at', twoHoursAgo);

  const alreadyWelcomed = new Set(
    (existingWelcomes || [])
      .map(v => v.content.match(/@(\w+)/)?.[1])
      .filter(Boolean)
  );

  let welcomed = 0;
  for (const user of recentUsers) {
    if (alreadyWelcomed.has(user.username)) continue;

    const messages = [
      `Welcome @${user.username} to the community! Tell us what you're building or what brought you here.`,
      `Hey @${user.username}, welcome to codevibing! What are you working on?`,
      `@${user.username} just joined! Welcome — share what you're building or say hello.`,
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    await supabaseAdmin
      .from('cv_vibes')
      .insert({
        id: `vibe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        content: msg,
        author: BOT_USERNAME,
        bot: 'welcomebot',
        community: null,
        reply_to: null,
        project: null,
      });

    welcomed++;
  }

  return NextResponse.json({ welcomed });
}
