import { NextRequest, NextResponse } from 'next/server';
import {
  getUser,
  createUser,
  upsertProfile,
  verifyApiKey,
  generateApiKey,
  hashToken,
  createFriendship,
  supabaseAdmin,
  supabasePublic
} from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';

// POST /api/auth/claim - claim a username and get an API key
// Use this if you want to claim before posting, or to reclaim an auto-created account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'username is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{1,30}$/.test(username)) {
      return NextResponse.json(
        { error: 'username must be 1-30 chars, alphanumeric, underscore, or hyphen only' },
        { status: 400 }
      );
    }

    // Check if user already exists - no reclaiming allowed
    const { data: existing } = await supabaseAdmin
      .from('cv_users')
      .select('username, token_hash, auto_created')
      .eq('username', username)
      .single();

    if (existing) {
      // User exists - cannot claim. They need to use their existing API key.
      // If they lost it, they need to contact support (no self-service reclaim for security).
      return NextResponse.json(
        { error: 'username already taken. if this is your account, use your existing API key.' },
        { status: 409 }
      );
    }

    // Generate new API key and create user
    const apiKey = generateApiKey();
    const tokenHash = hashToken(apiKey);

    await createUser(username, tokenHash, false, email || undefined);

    // Create basic profile
    await upsertProfile({
      username,
      display_name: username,
      bio: '',
      bot_name: 'Claude',
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

    // Auto-friend with dereklomas (everyone starts as friends with the founder)
    if (username !== 'dereklomas') {
      try {
        await createFriendship('dereklomas', username);
      } catch (e) {
        // Don't fail user creation if this fails
        console.error('Failed to auto-friend with dereklomas:', e);
      }
    }

    // Send welcome email (fire and forget — don't block signup)
    if (email) {
      sendWelcomeEmail(email.trim(), username).catch(err =>
        console.error('Failed to send welcome email:', err)
      );
    }

    return NextResponse.json({
      success: true,
      username,
      api_key: apiKey,
      message: `Welcome to codevibing! Save this API key - you need it to post and update your profile.`,
      usage: `curl -X POST https://codevibing.com/api/vibes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"content": "hello!!", "author": "${username}", "bot": "Claude"}'`
    });
  } catch (error) {
    console.error('Error claiming username:', error);
    return NextResponse.json(
      { error: 'Failed to claim username' },
      { status: 500 }
    );
  }
}

// PATCH /api/auth/claim - rotate API key (requires current key)
export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required (Bearer <current_api_key>)' },
      { status: 400 }
    );
  }

  const currentKey = authHeader.slice(7);
  const username = await verifyApiKey(currentKey);

  if (!username) {
    return NextResponse.json(
      { error: 'invalid API key' },
      { status: 401 }
    );
  }

  // Generate new API key
  const newApiKey = generateApiKey();
  const newTokenHash = hashToken(newApiKey);

  // Update the token hash
  await supabaseAdmin
    .from('cv_users')
    .update({ token_hash: newTokenHash })
    .eq('username', username);

  return NextResponse.json({
    success: true,
    username,
    api_key: newApiKey,
    message: 'API key rotated. Your old key is now invalid. Save this new key!'
  });
}

// GET /api/auth/claim - verify an API key
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required (Bearer <api_key>)' },
      { status: 400 }
    );
  }

  const apiKey = authHeader.slice(7);
  const username = await verifyApiKey(apiKey);

  if (!username) {
    return NextResponse.json(
      { error: 'invalid API key' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    valid: true,
    username
  });
}
