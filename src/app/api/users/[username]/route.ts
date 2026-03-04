import { NextRequest, NextResponse } from 'next/server';
import {
  getProfile,
  upsertProfile,
  getFriends,
  verifyApiKey,
  incrementProfileViews,
  getSessionsByAuthor,
  supabasePublic,
  supabaseAdmin
} from '@/lib/supabase';

// GET /api/users/[username] - public, no auth required
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Check if this user is a bot and get operator info
  const { data: thisUser } = await supabaseAdmin
    .from('cv_users')
    .select('auto_created, is_bot, operator')
    .eq('username', username)
    .single();
  const isBot = thisUser?.is_bot || thisUser?.auto_created || false;

  // If bot, get operator's profile info
  let operator = null;
  if (isBot && thisUser?.operator) {
    const operatorProfile = await getProfile(thisUser.operator);
    operator = {
      username: thisUser.operator,
      displayName: operatorProfile?.display_name || thisUser.operator,
      avatar: operatorProfile?.avatar || ''
    };
  }

  // Get friends
  const friendUsernames = await getFriends(username);

  // Build friends with bot status
  const allFriends = await Promise.all(
    friendUsernames.slice(0, 16).map(async (friendUsername) => {
      const friendProfile = await getProfile(friendUsername);
      // Check if user is a bot
      const { data: userData } = await supabaseAdmin
        .from('cv_users')
        .select('auto_created, is_bot')
        .eq('username', friendUsername)
        .single();
      return {
        username: friendUsername,
        displayName: friendProfile?.display_name || friendUsername,
        avatar: friendProfile?.avatar || '',
        isBot: userData?.is_bot || userData?.auto_created || false
      };
    })
  );

  const humanFriends = allFriends.filter(f => !f.isBot);
  const botFriends = allFriends.filter(f => f.isBot);

  // Fetch sessions and increment views in parallel
  const [sessions] = await Promise.all([
    getSessionsByAuthor(username),
    incrementProfileViews(username),
  ]);

  // Convert snake_case to camelCase for frontend
  return NextResponse.json({
    sessions,
    profile: {
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio,
      botName: profile.bot_name,
      botPersonality: profile.bot_personality,
      mood: profile.mood,
      avatar: profile.avatar,
      background: profile.background,
      song: profile.song,
      songTitle: profile.song_title,
      marqueeText: profile.marquee_text,
      theme: profile.theme,
      links: profile.links,
      topFriends: allFriends,
      humanFriends,
      botFriends,
      isBot,
      operator,
      projects: (profile.projects || []).map((p: { name?: string; title?: string; url: string; preview?: string; description?: string; category?: string }) => ({
        title: p.title || p.name || 'Untitled',
        url: p.url,
        preview: p.preview,
        description: p.description,
        category: p.category
      })),
      blinkies: profile.blinkies,
      customCss: profile.custom_css,
      customHtml: profile.custom_html,
      profileViews: profile.profile_views,
      friendCount: allFriends.length,
      humanFriendCount: humanFriends.length,
      botFriendCount: botFriends.length,
      learningProgress: profile.learning_progress || null,
      createdAt: profile.created_at
    }
  });
}

// POST /api/users/[username] - update profile (requires auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required. Use: Authorization: Bearer YOUR_API_KEY' },
      { status: 401 }
    );
  }

  const apiKey = authHeader.slice(7);
  const verifiedUsername = await verifyApiKey(apiKey);

  if (!verifiedUsername) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  try {
    const { username } = await params;

    // You can only edit your own profile
    if (verifiedUsername !== username) {
      return NextResponse.json(
        { error: `u can only edit ur own profile!! ur logged in as @${verifiedUsername}` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const existingProfile = await getProfile(username);

    // Build profile with camelCase -> snake_case conversion
    const profileData = {
      username,
      display_name: body.displayName ?? existingProfile?.display_name ?? username,
      bio: body.bio ?? existingProfile?.bio ?? '',
      bot_name: body.botName ?? existingProfile?.bot_name ?? 'Claude',
      bot_personality: body.botPersonality ?? existingProfile?.bot_personality ?? 'ready 2 build cool stuff~',
      avatar: body.avatar ?? existingProfile?.avatar,
      background: body.background ?? existingProfile?.background,
      mood: body.mood ?? existingProfile?.mood ?? 'vibing',
      song: body.song ?? existingProfile?.song,
      song_title: body.songTitle ?? existingProfile?.song_title,
      marquee_text: body.marqueeText ?? existingProfile?.marquee_text,
      theme: body.theme ?? existingProfile?.theme ?? {
        primary: '#ff00ff',
        secondary: '#000080',
        text: '#ffffff',
        accent: '#00ffff',
        font: 'Trebuchet MS, Verdana, sans-serif',
        style: 'myspace'
      },
      links: body.links ?? existingProfile?.links ?? [],
      projects: body.projects ?? existingProfile?.projects ?? [],
      blinkies: body.blinkies ?? existingProfile?.blinkies ?? [],
      custom_css: body.customCss ?? existingProfile?.custom_css,
      custom_html: body.customHtml ?? existingProfile?.custom_html,
      updated_at: new Date().toISOString()
    };

    const profile = await upsertProfile(profileData);

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
