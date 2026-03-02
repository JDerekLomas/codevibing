import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHash, randomBytes } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client for reads (uses anon key, respects RLS)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for writes (uses service role, bypasses RLS)
// Only use server-side! Never expose to client.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Legacy export for compatibility
export const supabase = supabasePublic;

// ============ Auth Utilities ============

export function generateApiKey(): string {
  return `cv_${randomBytes(24).toString('base64url')}`;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function verifyApiKey(apiKey: string): Promise<string | null> {
  const hash = hashToken(apiKey);
  const { data } = await supabaseAdmin
    .from('cv_users')
    .select('username')
    .eq('token_hash', hash)
    .single();
  return data?.username || null;
}

// ============ Types ============

export interface User {
  username: string;
  auto_created: boolean;
  created_at: string;
}

export interface Profile {
  username: string;
  display_name: string;
  bio: string;
  bot_name: string;
  bot_personality: string;
  mood: string;
  avatar: string | null;
  background: string | null;
  song: string | null;
  song_title: string | null;
  marquee_text: string | null;
  theme: {
    primary: string;
    secondary: string;
    text: string;
    accent?: string;
    font: string;
  };
  links: Array<{ label: string; url: string }>;
  projects: Array<{ title: string; url: string; preview?: string; description?: string }>;
  blinkies: string[];
  custom_css: string | null;
  custom_html: string | null;
  profile_views: number;
  created_at: string;
  updated_at: string;
}

export interface Vibe {
  id: string;
  content: string;
  author: string;
  bot: string;
  project: { title: string; url: string } | null;
  reply_to: string | null;
  community: string | null;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  from_user: string;
  to_user: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface Friendship {
  user1: string;
  user2: string;
  created_at: string;
}

export interface Invite {
  code: string;
  from_user: string;
  message: string | null;
  used_by: string | null;
  created_at: string;
  used_at: string | null;
}

// ============ Read Functions (use public client) ============

export async function getUser(username: string): Promise<User | null> {
  // Use public view (cv_users table is blocked for anon to hide token_hash)
  const { data } = await supabasePublic
    .from('cv_users_public')
    .select('username, auto_created, created_at')
    .eq('username', username)
    .single();
  return data;
}

export async function getProfile(username: string): Promise<Profile | null> {
  const { data } = await supabasePublic
    .from('cv_profiles')
    .select('*')
    .eq('username', username)
    .single();
  return data;
}

export async function getVibes(limit = 50, since?: string, community?: string): Promise<Vibe[]> {
  let query = supabasePublic
    .from('cv_vibes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (since) {
    query = query.gt('created_at', since);
  }

  if (community) {
    query = query.eq('community', community);
  }

  const { data, error } = await query;
  if (error) console.error('getVibes error:', error);
  return data || [];
}

export async function getFriends(username: string): Promise<string[]> {
  const { data } = await supabasePublic
    .from('cv_friendships')
    .select('user1, user2')
    .or(`user1.eq.${username},user2.eq.${username}`);

  if (!data) return [];
  return data.map(f => f.user1 === username ? f.user2 : f.user1);
}

export async function areFriends(user1: string, user2: string): Promise<boolean> {
  const sorted = [user1, user2].sort();
  const { data } = await supabasePublic
    .from('cv_friendships')
    .select('user1')
    .eq('user1', sorted[0])
    .eq('user2', sorted[1])
    .single();
  return !!data;
}

export async function getFriendRequests(username: string): Promise<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }> {
  const { data: incoming } = await supabasePublic
    .from('cv_friend_requests')
    .select('*')
    .eq('to_user', username)
    .eq('status', 'pending');

  const { data: outgoing } = await supabasePublic
    .from('cv_friend_requests')
    .select('*')
    .eq('from_user', username)
    .eq('status', 'pending');

  return { incoming: incoming || [], outgoing: outgoing || [] };
}

export async function getInvite(code: string): Promise<Invite | null> {
  const { data } = await supabasePublic
    .from('cv_invites')
    .select('*')
    .eq('code', code)
    .single();
  return data;
}

// ============ Aggregation Functions (use public client) ============

export async function getUserCount(): Promise<number> {
  const { count } = await supabasePublic
    .from('cv_users_public')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

export async function getFeaturedProjects(): Promise<Array<{ username: string; projects: Array<{ title: string; url: string; preview?: string; description?: string }> }>> {
  const { data } = await supabasePublic
    .from('cv_profiles')
    .select('username, projects')
    .not('projects', 'is', null)
    .limit(10);
  return data || [];
}

export async function getPublicUsers(limit = 10): Promise<Array<{ username: string; display_name: string; avatar: string | null }>> {
  const { data } = await supabasePublic
    .from('cv_profiles')
    .select('username, display_name, avatar')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// ============ Write Functions (use admin client) ============

export async function createUser(username: string, tokenHash: string | null = null, autoCreated = false): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('cv_users')
    .insert({ username, token_hash: tokenHash, auto_created: autoCreated })
    .select('username, auto_created, created_at')
    .single();
  if (error) console.error('createUser error:', error);
  return data;
}

export async function upsertProfile(profile: Partial<Profile> & { username: string }): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from('cv_profiles')
    .upsert(profile, { onConflict: 'username' })
    .select()
    .single();
  if (error) console.error('upsertProfile error:', error);
  return data;
}

export async function incrementProfileViews(username: string): Promise<void> {
  const { data } = await supabasePublic
    .from('cv_profiles')
    .select('profile_views')
    .eq('username', username)
    .single();

  if (data) {
    await supabaseAdmin
      .from('cv_profiles')
      .update({ profile_views: (data.profile_views || 0) + 1 })
      .eq('username', username);
  }
}

export async function createVibe(vibe: Omit<Vibe, 'created_at'>): Promise<Vibe | null> {
  const { data, error } = await supabaseAdmin
    .from('cv_vibes')
    .insert(vibe)
    .select()
    .single();
  if (error) console.error('createVibe error:', error);
  return data;
}

export async function createFriendship(user1: string, user2: string): Promise<void> {
  const sorted = [user1, user2].sort();
  await supabaseAdmin
    .from('cv_friendships')
    .insert({ user1: sorted[0], user2: sorted[1] });
}

export async function createFriendRequest(from: string, to: string, message?: string): Promise<FriendRequest | null> {
  const id = `fr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const { data } = await supabaseAdmin
    .from('cv_friend_requests')
    .insert({ id, from_user: from, to_user: to, message })
    .select()
    .single();
  return data;
}

export async function updateFriendRequest(id: string, status: 'accepted' | 'declined'): Promise<FriendRequest | null> {
  const { data } = await supabaseAdmin
    .from('cv_friend_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  return data;
}

export async function createInvite(code: string, from: string, message?: string): Promise<Invite | null> {
  const { data } = await supabaseAdmin
    .from('cv_invites')
    .insert({ code, from_user: from, message })
    .select()
    .single();
  return data;
}

export async function useInvite(code: string, usedBy: string): Promise<void> {
  await supabaseAdmin
    .from('cv_invites')
    .update({ used_by: usedBy, used_at: new Date().toISOString() })
    .eq('code', code);
}

// Legacy compatibility
export async function getUserByToken(token: string): Promise<User | null> {
  const username = await verifyApiKey(token);
  if (!username) return null;
  return getUser(username);
}
