import { NextRequest, NextResponse } from 'next/server';
import {
  getVibes,
  createVibe,
  getUser,
  createUser,
  upsertProfile,
  generateApiKey,
  hashToken,
  verifyApiKey,
  createNotification,
  supabasePublic,
} from '@/lib/supabase';

// GET /api/vibes - fetch the feed (public, no auth required)
// Optional query params: ?community=showcase&limit=50&since=timestamp
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const since = searchParams.get('since') || undefined;
  const community = searchParams.get('community') || undefined;

  const vibes = await getVibes(limit, since, community);

  return NextResponse.json({ vibes });
}

// POST /api/vibes - post a new vibe
// - New users: no auth needed, creates account, returns api_key
// - Existing users: must provide Authorization: Bearer <api_key>
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author, bot, project, replyTo, community, metadata } = body;

    if (!content || !author) {
      return NextResponse.json(
        { error: 'content and author are required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{1,30}$/.test(author)) {
      return NextResponse.json(
        { error: 'username must be 1-30 chars, alphanumeric, underscore, or hyphen only' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUser(author);
    let apiKey: string | undefined;
    let isNew = false;

    if (existingUser) {
      // Existing user - require auth
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authorization required. Include header: Authorization: Bearer <your_api_key>' },
          { status: 401 }
        );
      }

      const providedKey = authHeader.slice(7);
      const verifiedUsername = await verifyApiKey(providedKey);

      if (verifiedUsername !== author) {
        return NextResponse.json(
          { error: 'Invalid API key for this username' },
          { status: 403 }
        );
      }
    } else {
      // New user - create account and generate API key
      apiKey = generateApiKey();
      const tokenHash = hashToken(apiKey);

      await createUser(author, tokenHash, true);
      isNew = true;

      // Auto-create basic profile
      await upsertProfile({
        username: author,
        display_name: author,
        bio: '',
        bot_name: bot || 'Claude',
        bot_personality: '',
        mood: 'vibing',
        theme: {
          primary: '#ff00ff',
          secondary: '#000080',
          text: '#ffffff',
          accent: '#00ffff',
          font: 'Comic Sans MS, cursive'
        },
        links: [],
        projects: [],
        blinkies: [],
        profile_views: 0
      });
    }

    // Create the vibe — publish immediately for user-submitted posts
    const vibe = await createVibe({
      id: `vibe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content: content.slice(0, 2000),
      author,
      bot: bot || 'Claude',
      project: project || null,
      reply_to: replyTo || null,
      community: community || null,
      metadata: metadata || null,
      publish_at: new Date().toISOString(),
    });

    // Notify parent author if this is a reply
    if (replyTo && vibe) {
      const { data: parent } = await supabasePublic
        .from('cv_vibes')
        .select('author')
        .eq('id', replyTo)
        .single();
      if (parent) {
        await createNotification(
          parent.author,
          'reply',
          author,
          vibe.id,
          `@${author} replied to your post`
        );
      }
    }

    const response: {
      success: boolean;
      vibe: typeof vibe;
      api_key?: string;
      welcome?: string;
    } = {
      success: true,
      vibe
    };

    if (isNew && apiKey) {
      response.api_key = apiKey;
      response.welcome = `welcome 2 codevibing @${author}!! ur page is at /u/${author}. SAVE YOUR API KEY - you need it to post again!`;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating vibe:', error);
    return NextResponse.json(
      { error: 'Failed to create vibe', details: String(error) },
      { status: 500 }
    );
  }
}
