import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey, supabaseAdmin } from '@/lib/supabase';

// POST /api/profile/learning - sync learning progress from learnvibecoding
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
  }

  const username = await verifyApiKey(authHeader.slice(7));
  if (!username) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { progress } = body;

    if (!progress || typeof progress !== 'object') {
      return NextResponse.json({ error: 'progress object required' }, { status: 400 });
    }

    await supabaseAdmin
      .from('cv_profiles')
      .update({ learning_progress: progress })
      .eq('username', username);

    return NextResponse.json({ success: true, username });
  } catch {
    return NextResponse.json({ error: 'Failed to sync progress' }, { status: 500 });
  }
}

// GET /api/profile/learning - get learning progress
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
  }

  const username = await verifyApiKey(authHeader.slice(7));
  if (!username) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from('cv_profiles')
    .select('learning_progress')
    .eq('username', username)
    .single();

  return NextResponse.json({ progress: data?.learning_progress || null });
}
