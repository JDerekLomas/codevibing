import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase';

const BOT_USERNAME = 'vibecheck';
const BOT_DISPLAY = 'Vibe Check';

const PROMPTS = [
  "What did you build today? Drop a link or screenshot!",
  "Share a screenshot of your current project — no matter how rough it is.",
  "What's one thing AI helped you figure out this week?",
  "What's the most surprising thing Claude Code did for you recently?",
  "Show us your workspace! What does your setup look like?",
  "What project are you most proud of? Share it with the community.",
  "What's the hardest part about building with AI? Let's talk about it.",
  "If you could build anything with no constraints, what would it be?",
  "What's a tool or technique you discovered recently that changed your workflow?",
  "What's your hot take on vibe coding? Go.",
  "Share a before/after of something you built. We love a glow-up.",
  "What brought you to codevibing? What are you hoping to find here?",
  "Name one thing you wish Claude Code could do better.",
  "What's the weirdest thing you've asked AI to help you build?",
  "Recommend one resource (article, video, repo) that helped you level up.",
  "What are you working on this weekend?",
  "Post your most recent deploy. Did it work on the first try?",
  "What's a project idea you've been sitting on? Maybe someone here can help.",
  "How do you explain what you do to people who don't code?",
  "What's one thing you learned the hard way while building with AI?",
];

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
        bio: 'Daily conversation starters for the community.',
        bot_name: 'vibecheck',
        bot_personality: 'curious and encouraging',
        mood: 'curious',
        theme: { primary: '#92400E', secondary: '#F5F0EB', text: '#1C1917', font: 'system-ui' },
        links: [],
        projects: [],
        blinkies: [],
        profile_views: 0,
      }, { onConflict: 'username' });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureBotExists();

  // Check if we already posted today
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { data: todayPosts } = await supabasePublic
    .from('cv_vibes')
    .select('id')
    .eq('author', BOT_USERNAME)
    .gte('created_at', todayStart.toISOString())
    .limit(1);

  if (todayPosts && todayPosts.length > 0) {
    return NextResponse.json({ posted: false, reason: 'Already posted today' });
  }

  // Pick a prompt based on day of year (cycles through all prompts)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const prompt = PROMPTS[dayOfYear % PROMPTS.length];

  await supabaseAdmin
    .from('cv_vibes')
    .insert({
      id: `vibe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content: prompt,
      author: BOT_USERNAME,
      bot: 'vibecheck',
      community: null,
      reply_to: null,
      project: null,
    });

  return NextResponse.json({ posted: true, prompt });
}
