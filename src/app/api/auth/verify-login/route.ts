import { NextRequest, NextResponse } from 'next/server';
import { generateApiKey, hashToken, supabaseAdmin } from '@/lib/supabase';
import { verifyMagicToken } from '@/lib/magic-link';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'token required' }, { status: 400 });
    }

    const username = verifyMagicToken(token);
    if (!username) {
      return NextResponse.json(
        { error: 'Invalid or expired login link. Request a new one.' },
        { status: 401 }
      );
    }

    // Generate a fresh API key (rotates the old one)
    const newApiKey = generateApiKey();
    const newTokenHash = hashToken(newApiKey);

    const { error } = await supabaseAdmin
      .from('cv_users')
      .update({ token_hash: newTokenHash })
      .eq('username', username);

    if (error) {
      console.error('verify-login update error:', error);
      return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      api_key: newApiKey,
      username,
    });
  } catch (error) {
    console.error('verify-login error:', error);
    return NextResponse.json({ error: 'Failed to verify login' }, { status: 500 });
  }
}
