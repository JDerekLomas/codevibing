import { NextRequest, NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin, verifyApiKey } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/communities/[slug] - get community info and posts
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  // Get community info
  const { data: community, error: communityError } = await supabasePublic
    .from('cv_communities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (communityError || !community) {
    return NextResponse.json(
      { error: 'Community not found' },
      { status: 404 }
    );
  }

  // Get posts in this community
  const { data: posts } = await supabasePublic
    .from('cv_vibes')
    .select('*')
    .eq('community', slug)
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })
    .limit(limit);

  // Get member count
  const { count } = await supabasePublic
    .from('cv_community_members')
    .select('*', { count: 'exact', head: true })
    .eq('community_slug', slug);

  return NextResponse.json({
    community: {
      ...community,
      member_count: count || 0
    },
    posts: posts || []
  });
}

// POST /api/communities/[slug] - join community
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
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

  // Check community exists
  const { data: community } = await supabasePublic
    .from('cv_communities')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (!community) {
    return NextResponse.json(
      { error: 'Community not found' },
      { status: 404 }
    );
  }

  // Join community (upsert to handle re-joining)
  const { error } = await supabaseAdmin
    .from('cv_community_members')
    .upsert({
      community_slug: slug,
      username,
      role: 'member'
    }, { onConflict: 'community_slug,username' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update member count
  const { count } = await supabasePublic
    .from('cv_community_members')
    .select('*', { count: 'exact', head: true })
    .eq('community_slug', slug);

  await supabaseAdmin
    .from('cv_communities')
    .update({ member_count: count })
    .eq('slug', slug);

  return NextResponse.json({ success: true, message: `Joined ${slug}` });
}

// DELETE /api/communities/[slug] - leave community
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
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

  await supabaseAdmin
    .from('cv_community_members')
    .delete()
    .eq('community_slug', slug)
    .eq('username', username);

  // Update member count
  const { count } = await supabasePublic
    .from('cv_community_members')
    .select('*', { count: 'exact', head: true })
    .eq('community_slug', slug);

  await supabaseAdmin
    .from('cv_communities')
    .update({ member_count: count })
    .eq('slug', slug);

  return NextResponse.json({ success: true, message: `Left ${slug}` });
}
