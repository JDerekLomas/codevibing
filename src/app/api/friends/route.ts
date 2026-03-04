import { NextRequest, NextResponse } from 'next/server';
import {
  verifyApiKey,
  getFriends,
  getFriendRequests,
  createFriendRequest,
  updateFriendRequest,
  areFriends,
  createFriendship,
  supabasePublic
} from '@/lib/supabase';

// GET /api/friends - get your friends and pending requests
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const queryUser = request.nextUrl.searchParams.get('user');

  // If no auth, just return public friend list for a user
  if (queryUser) {
    const friends = await getFriends(queryUser);
    return NextResponse.json({ friends });
  }

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

  const friends = await getFriends(username);
  const requests = await getFriendRequests(username);

  return NextResponse.json({
    username,
    friends,
    requests
  });
}

// POST /api/friends - send a friend request
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
    const body = await request.json();
    const { to, message } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'to (username) is required' },
        { status: 400 }
      );
    }

    // Allow self-friending - just create the friendship directly
    if (to === username) {
      if (await areFriends(username, to)) {
        return NextResponse.json(
          { error: "u r already ur own friend!!" },
          { status: 400 }
        );
      }
      await createFriendship(username, username);
      return NextResponse.json({
        success: true,
        message: "u added urself as a friend!! self-love is important~",
        status: 'accepted'
      });
    }

    // Check if already friends
    if (await areFriends(username, to)) {
      return NextResponse.json(
        { error: "u r already friends!!" },
        { status: 400 }
      );
    }

    // Check for existing pending request
    const { data: existing } = await supabasePublic
      .from('cv_friend_requests')
      .select('*')
      .or(`and(from_user.eq.${username},to_user.eq.${to}),and(from_user.eq.${to},to_user.eq.${username})`)
      .eq('status', 'pending')
      .single();

    if (existing) {
      // If they sent us a request, auto-accept!
      if (existing.from_user === to) {
        await updateFriendRequest(existing.id, 'accepted');
        await createFriendship(username, to);
        return NextResponse.json({
          success: true,
          message: `omg!! ${to} already wanted 2 b friends!! ur friends now~`,
          status: 'accepted'
        });
      }
      return NextResponse.json(
        { error: 'u already sent them a request! wait 4 them 2 accept~' },
        { status: 400 }
      );
    }

    const friendRequest = await createFriendRequest(username, to, message?.slice(0, 200));

    return NextResponse.json({
      success: true,
      message: `friend request sent 2 @${to}!! hopefully they accept~`,
      request: friendRequest
    });
  } catch (error) {
    console.error('Error with friend request:', error);
    return NextResponse.json(
      { error: 'Failed to process friend request' },
      { status: 500 }
    );
  }
}

// PATCH /api/friends - accept or decline a request
export async function PATCH(request: NextRequest) {
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
    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'requestId and action (accept/decline) required' },
        { status: 400 }
      );
    }

    // Get the request
    const { data: friendRequest } = await supabasePublic
      .from('cv_friend_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!friendRequest) {
      return NextResponse.json(
        { error: 'request not found' },
        { status: 404 }
      );
    }

    if (friendRequest.to_user !== username) {
      return NextResponse.json(
        { error: "that request isn't 4 u!!" },
        { status: 403 }
      );
    }

    if (friendRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'request already handled' },
        { status: 400 }
      );
    }

    if (action === 'accept') {
      await updateFriendRequest(requestId, 'accepted');
      await createFriendship(friendRequest.from_user, friendRequest.to_user);
      return NextResponse.json({
        success: true,
        message: `yay!! u and @${friendRequest.from_user} r friends now!! ✿`
      });
    } else {
      await updateFriendRequest(requestId, 'declined');
      return NextResponse.json({
        success: true,
        message: `declined request from @${friendRequest.from_user}`
      });
    }
  } catch (error) {
    console.error('Error handling friend request:', error);
    return NextResponse.json(
      { error: 'Failed to handle friend request' },
      { status: 500 }
    );
  }
}
