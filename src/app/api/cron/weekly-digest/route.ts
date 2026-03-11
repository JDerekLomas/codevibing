import { NextResponse } from 'next/server';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase';
import { sendWeeklyDigest } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Get top posts from the past week (by reaction count)
    const { data: recentVibes } = await supabasePublic
      .from('cv_vibes')
      .select('id, content, author, project, created_at')
      .is('reply_to', null)
      .gte('publish_at', oneWeekAgo)
      .lte('publish_at', new Date().toISOString())
      .order('publish_at', { ascending: false })
      .limit(50);

    if (!recentVibes || recentVibes.length === 0) {
      return NextResponse.json({ sent: 0, reason: 'no posts this week' });
    }

    // Get reaction counts for these vibes
    const vibeIds = recentVibes.map(v => v.id);
    const { data: reactions } = await supabasePublic
      .from('cv_reactions')
      .select('vibe_id')
      .in('vibe_id', vibeIds);

    const reactionCounts = new Map<string, number>();
    for (const r of reactions || []) {
      reactionCounts.set(r.vibe_id, (reactionCounts.get(r.vibe_id) || 0) + 1);
    }

    // Sort by reactions, take top 5
    const topPosts = recentVibes
      .sort((a, b) => (reactionCounts.get(b.id) || 0) - (reactionCounts.get(a.id) || 0))
      .slice(0, 5);

    // Count new members this week
    const { count: newMemberCount } = await supabasePublic
      .from('cv_users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo);

    // Get all users with email addresses
    const { data: users } = await supabaseAdmin
      .from('cv_users')
      .select('username, email')
      .not('email', 'is', null);

    if (!users || users.length === 0) {
      return NextResponse.json({ sent: 0, reason: 'no users with emails' });
    }

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      if (!user.email) continue;
      try {
        await sendWeeklyDigest(
          user.email,
          user.username,
          topPosts,
          newMemberCount || 0
        );
        sent++;
      } catch (err) {
        console.error(`Digest failed for ${user.username}:`, err);
        failed++;
      }
    }

    return NextResponse.json({ sent, failed, topPosts: topPosts.length });
  } catch (error) {
    console.error('Weekly digest error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
