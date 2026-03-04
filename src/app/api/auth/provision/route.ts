import { NextRequest, NextResponse } from 'next/server';
import {
  createUser,
  upsertProfile,
  generateApiKey,
  hashToken,
  createFriendship,
  supabaseAdmin
} from '@/lib/supabase';

// POST /api/auth/provision - auto-provision an account (zero friction)
// Used by CLI tools to auto-create accounts on first use
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let { username } = body;
    const { machine_id } = body; // optional machine identifier for uniqueness

    // If no username provided, generate one
    if (!username) {
      // Generate a fun random username
      const adjectives = ['happy', 'cosmic', 'pixel', 'neon', 'cyber', 'retro', 'chill', 'zen', 'rad', 'epic'];
      const nouns = ['coder', 'hacker', 'maker', 'builder', 'viber', 'dev', 'creator', 'artist', 'wizard', 'ninja'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 1000);
      username = `${adj}${noun}${num}`;
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{1,30}$/.test(username)) {
      return NextResponse.json(
        { error: 'username must be 1-30 chars, alphanumeric, underscore, or hyphen only' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const { data: existing } = await supabaseAdmin
      .from('cv_users')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      // If machine_id provided and matches, return error suggesting they already have an account
      return NextResponse.json(
        { error: 'username taken', suggestion: `${username}${Math.floor(Math.random() * 1000)}` },
        { status: 409 }
      );
    }

    // Generate API key
    const apiKey = generateApiKey();
    const tokenHash = hashToken(apiKey);

    // Create user (not auto_created since they're explicitly provisioning)
    await createUser(username, tokenHash, false);

    // Create profile with clean defaults
    await upsertProfile({
      username,
      display_name: username,
      bio: '',
      bot_name: 'Claude',
      bot_personality: '',
      mood: 'vibing',
      theme: {
        primary: '#1a1a1a',
        secondary: '#fafafa',
        text: '#374151',
        accent: '#b45309',
        font: 'Inter, system-ui, sans-serif'
      },
      links: [],
      projects: [],
      blinkies: [],
      profile_views: 0
    });

    // Auto-friend with dereklomas
    if (username !== 'dereklomas') {
      try {
        await createFriendship('dereklomas', username);
      } catch (e) {
        // Don't fail provisioning if this fails
        console.error('Failed to auto-friend with dereklomas:', e);
      }
    }

    return NextResponse.json({
      success: true,
      username,
      api_key: apiKey,
      profile_url: `https://codevibing.com/u/${username}`,
      message: `welcome to codevibing, @${username}! you're now friends with @dereklomas`
    });
  } catch (error) {
    console.error('Error provisioning account:', error);
    return NextResponse.json(
      { error: 'Failed to provision account' },
      { status: 500 }
    );
  }
}
