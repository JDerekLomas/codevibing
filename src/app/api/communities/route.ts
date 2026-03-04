import { NextRequest, NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin, verifyApiKey } from '@/lib/supabase';

// GET /api/communities - list all communities
export async function GET() {
  const { data, error } = await supabasePublic
    .from('cv_communities')
    .select('*')
    .order('post_count', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ communities: data });
}

// POST /api/communities - create a new community (requires auth)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization required' },
      { status: 401 }
    );
  }

  const apiKey = authHeader.slice(7);
  const username = await verifyApiKey(apiKey);

  if (!username) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { slug, name, description, icon } = body;

  if (!slug || !name) {
    return NextResponse.json(
      { error: 'slug and name are required' },
      { status: 400 }
    );
  }

  // Validate slug format
  if (!/^[a-z0-9-]{2,30}$/.test(slug)) {
    return NextResponse.json(
      { error: 'slug must be 2-30 chars, lowercase letters, numbers, hyphens only' },
      { status: 400 }
    );
  }

  // Check if slug is taken
  const { data: existing } = await supabasePublic
    .from('cv_communities')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: 'Community slug already taken' },
      { status: 409 }
    );
  }

  // Create community
  const { data, error } = await supabaseAdmin
    .from('cv_communities')
    .insert({
      slug,
      name,
      description: description || '',
      icon: icon || '💬',
      created_by: username,
      member_count: 1
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add creator as admin
  await supabaseAdmin
    .from('cv_community_members')
    .insert({
      community_slug: slug,
      username,
      role: 'admin'
    });

  return NextResponse.json({ success: true, community: data });
}
