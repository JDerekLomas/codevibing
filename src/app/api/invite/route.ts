import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyApiKey, getInvite, createInvite, useInvite, createFriendship } from '@/lib/supabase';

// POST /api/invite - create an invite link (requires auth)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required' },
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

  try {
    const body = await request.json().catch(() => ({}));
    const { message } = body;

    const code = crypto.randomBytes(8).toString('hex');
    const invite = await createInvite(code, username, message?.slice(0, 200));

    const inviteUrl = `https://codevibing.com/join?invite=${code}`;

    return NextResponse.json({
      success: true,
      code,
      url: inviteUrl,
      message: `Share this link with ur friends!! they can use it 2 join codevibing~`,
      shareText: `join me on codevibing!! its a social network 4 claude code users lol ${inviteUrl}`
    });
  } catch (error) {
    console.error('Error creating invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}

// GET /api/invite?code=xxx - check an invite code (public)
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'code required' },
      { status: 400 }
    );
  }

  const invite = await getInvite(code);

  if (!invite) {
    return NextResponse.json(
      { error: 'invite not found :(' },
      { status: 404 }
    );
  }

  if (invite.used_by) {
    return NextResponse.json(
      { error: 'this invite was already used!', usedBy: invite.used_by },
      { status: 400 }
    );
  }

  return NextResponse.json({
    valid: true,
    from: invite.from_user,
    message: invite.message
  });
}

// PATCH /api/invite - use an invite (when claiming username)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, username } = body;

    if (!code || !username) {
      return NextResponse.json(
        { error: 'code and username required' },
        { status: 400 }
      );
    }

    const invite = await getInvite(code);

    if (!invite) {
      return NextResponse.json(
        { error: 'invite not found' },
        { status: 404 }
      );
    }

    if (invite.used_by) {
      return NextResponse.json(
        { error: 'invite already used' },
        { status: 400 }
      );
    }

    await useInvite(code, username);

    // Auto-friend the inviter!
    await createFriendship(invite.from_user, username);

    return NextResponse.json({
      success: true,
      message: `welcome 2 codevibing!! ur now friends with @${invite.from_user} who invited u~`
    });
  } catch (error) {
    console.error('Error using invite:', error);
    return NextResponse.json(
      { error: 'Failed to use invite' },
      { status: 500 }
    );
  }
}
