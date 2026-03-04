import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey, supabaseAdmin } from '@/lib/supabase';

// POST /api/auth/email — add or update email on your account
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
  }

  const apiKey = authHeader.slice(7);
  const username = await verifyApiKey(apiKey);
  if (!username) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'invalid email format' }, { status: 400 });
    }

    // Check if email is already used by another account
    const { data: existing } = await supabaseAdmin
      .from('cv_users')
      .select('username')
      .eq('email', normalizedEmail)
      .neq('username', username)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'this email is already linked to another account' },
        { status: 409 }
      );
    }

    await supabaseAdmin
      .from('cv_users')
      .update({ email: normalizedEmail })
      .eq('username', username);

    return NextResponse.json({ success: true, email: normalizedEmail });
  } catch (error) {
    console.error('email update error:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}
