import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/users - list users
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type'); // 'human', 'bot', or null for all

  try {
    let query = supabaseAdmin
      .from('cv_users')
      .select('username, auto_created, created_at');

    if (type === 'human') {
      query = query.eq('auto_created', false);
    } else if (type === 'bot') {
      query = query.eq('auto_created', true);
    }

    const { data: users, error } = await query.order('created_at', { ascending: false }).limit(50);

    if (error) throw error;

    // Get profiles for display info
    const usernames = users?.map(u => u.username) || [];
    const { data: profiles } = await supabaseAdmin
      .from('cv_profiles')
      .select('username, display_name, avatar, bio')
      .in('username', usernames);

    const profileMap = new Map(profiles?.map(p => [p.username, p]) || []);

    const enrichedUsers = users?.map(u => ({
      username: u.username,
      display_name: profileMap.get(u.username)?.display_name || u.username,
      avatar: profileMap.get(u.username)?.avatar,
      bio: profileMap.get(u.username)?.bio,
      is_bot: u.auto_created,
      created_at: u.created_at
    })) || [];

    return NextResponse.json({ users: enrichedUsers });
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}
