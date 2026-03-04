import { NextResponse } from 'next/server';
import { verifyApiKey, supabaseAdmin, supabasePublic } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/vibes/[id]/react — get reaction count and whether current user reacted
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const { count } = await supabasePublic
    .from('cv_reactions')
    .select('*', { count: 'exact', head: true })
    .eq('vibe_id', id);

  // Check if a specific user has reacted (via query param)
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  let reacted = false;

  if (username) {
    const { data } = await supabasePublic
      .from('cv_reactions')
      .select('id')
      .eq('vibe_id', id)
      .eq('username', username)
      .single();
    reacted = !!data;
  }

  return NextResponse.json({ count: count || 0, reacted });
}

// POST /api/vibes/[id]/react — toggle heart reaction
export async function POST(request: Request, context: RouteContext) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = await verifyApiKey(authHeader.slice(7));
  if (!username) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const { id } = await context.params;

  // Check if already reacted
  const { data: existing } = await supabasePublic
    .from('cv_reactions')
    .select('id')
    .eq('vibe_id', id)
    .eq('username', username)
    .single();

  if (existing) {
    // Remove reaction
    await supabaseAdmin
      .from('cv_reactions')
      .delete()
      .eq('vibe_id', id)
      .eq('username', username);
    return NextResponse.json({ reacted: false });
  } else {
    // Add reaction
    await supabaseAdmin
      .from('cv_reactions')
      .insert({ vibe_id: id, username });
    return NextResponse.json({ reacted: true });
  }
}
