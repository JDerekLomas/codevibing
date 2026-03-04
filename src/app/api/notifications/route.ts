import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey, supabasePublic, supabaseAdmin } from '@/lib/supabase';

// GET /api/notifications — fetch notifications for authenticated user
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = await verifyApiKey(authHeader.slice(7));
  if (!username) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';

  let query = supabasePublic
    .from('cv_notifications')
    .select('*')
    .eq('recipient', username)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data } = await query;
  return NextResponse.json({ notifications: data || [] });
}

// PATCH /api/notifications — mark all as read
export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = await verifyApiKey(authHeader.slice(7));
  if (!username) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  await supabaseAdmin
    .from('cv_notifications')
    .update({ read: true })
    .eq('recipient', username)
    .eq('read', false);

  return NextResponse.json({ success: true });
}
