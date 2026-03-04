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
  learning_progress: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface BuildLogMeta {
  type: 'build_log';
  title: string;
  tools?: string[];
  link?: string;
  screenshot?: string;
}

export interface Vibe {
  id: string;
  content: string;
  author: string;
  bot: string;
  project: { title: string; url: string } | null;
  reply_to: string | null;
  community: string | null;
  metadata: BuildLogMeta | null;
  publish_at: string;
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
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })
    .limit(limit);

  if (since) {
    query = query.gt('publish_at', since);
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

// ============ Session Replay Functions (use public client) ============

export interface SessionSummary {
  slug: string;
  title: string;
  author: string;
  thumbnail: string | null;
  duration: string | null;
  prompt_count: number | null;
}

export async function getSessionsByAuthor(author: string): Promise<SessionSummary[]> {
  const { data, error } = await supabasePublic
    .from('cv_sessions')
    .select('slug, title, author, thumbnail, duration, prompt_count')
    .eq('author', author)
    .order('created_at', { ascending: false });
  if (error) console.error('getSessionsByAuthor error:', error);
  return data || [];
}

export async function getAllSessions(): Promise<SessionSummary[]> {
  const { data, error } = await supabasePublic
    .from('cv_sessions')
    .select('slug, title, author, thumbnail, duration, prompt_count')
    .order('created_at', { ascending: false });
  if (error) console.error('getAllSessions error:', error);
  return data || [];
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

export async function getReactionCounts(vibeIds: string[], username?: string): Promise<Map<string, { count: number; reacted: boolean }>> {
  const result = new Map<string, { count: number; reacted: boolean }>();
  if (vibeIds.length === 0) return result;

  // Get counts
  const { data: reactions } = await supabasePublic
    .from('cv_reactions')
    .select('vibe_id, username')
    .in('vibe_id', vibeIds);

  // Aggregate
  for (const id of vibeIds) {
    const vibeReactions = (reactions || []).filter(r => r.vibe_id === id);
    result.set(id, {
      count: vibeReactions.length,
      reacted: username ? vibeReactions.some(r => r.username === username) : false,
    });
  }
  return result;
}

export async function getCommunities(): Promise<Array<{ slug: string; name: string; description: string; post_count: number; member_count: number }>> {
  const { data } = await supabasePublic
    .from('cv_communities')
    .select('slug, name, description, post_count, member_count')
    .order('post_count', { ascending: false });
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

export async function createUser(username: string, tokenHash: string | null = null, autoCreated = false, email?: string): Promise<User | null> {
  const row: Record<string, unknown> = { username, token_hash: tokenHash, auto_created: autoCreated };
  if (email) row.email = email;
  const { data, error } = await supabaseAdmin
    .from('cv_users')
    .insert(row)
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

const MAX_POSTS_PER_DAY = 3;

async function getNextPublishSlot(): Promise<string> {
  // Find the earliest day (starting today) with fewer than MAX_POSTS_PER_DAY scheduled
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get all future scheduled posts (today and beyond), ordered by publish_at
  const { data: scheduled } = await supabaseAdmin
    .from('cv_vibes')
    .select('publish_at')
    .gte('publish_at', today.toISOString())
    .order('publish_at', { ascending: true });

  // Count posts per day
  const countsByDay = new Map<string, number>();
  for (const row of scheduled || []) {
    const day = row.publish_at.slice(0, 10); // YYYY-MM-DD
    countsByDay.set(day, (countsByDay.get(day) || 0) + 1);
  }

  // Find first day with room, starting from today
  let candidate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dayStr = candidate.toISOString().slice(0, 10);
    if ((countsByDay.get(dayStr) || 0) < MAX_POSTS_PER_DAY) {
      // Pick a random time during the day (9am-9pm) for natural spacing
      const hour = 9 + Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      candidate.setHours(hour, minute, 0, 0);
      // If it's today but the time is in the past, that's fine — it publishes immediately
      return candidate.toISOString();
    }
    candidate.setDate(candidate.getDate() + 1);
  }

  return now.toISOString(); // fallback
}

export async function createVibe(vibe: Omit<Vibe, 'created_at' | 'publish_at'> & { publish_at?: string }): Promise<Vibe | null> {
  // If no publish_at provided, auto-schedule based on daily limit
  const publishAt = vibe.publish_at || await getNextPublishSlot();

  const { data, error } = await supabaseAdmin
    .from('cv_vibes')
    .insert({ ...vibe, publish_at: publishAt })
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

export async function createNotification(recipient: string, type: string, actor: string, referenceId?: string, message?: string): Promise<void> {
  if (recipient === actor) return; // Don't notify yourself
  await supabaseAdmin
    .from('cv_notifications')
    .insert({
      recipient,
      type,
      actor,
      reference_id: referenceId,
      message,
    });
}

// ============ Project Pool & Ratings ============

export interface Project {
  id: string;
  title: string;
  url: string;
  description: string | null;
  preview: string | null;
  author: string;
  source: string;
  created_at: string;
}

export interface ProjectWithStats extends Project {
  hot_count: number;
  total_votes: number;
  hot_percent: number;
}

export async function getUnratedProjects(voterId: string, count = 5): Promise<Project[]> {
  // Get project IDs this voter has already rated
  const { data: rated } = await supabasePublic
    .from('cv_ratings')
    .select('project_id')
    .eq('voter_id', voterId);

  const ratedIds = (rated || []).map(r => r.project_id);

  let query = supabasePublic
    .from('cv_projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(count);

  if (ratedIds.length > 0) {
    // Supabase doesn't support NOT IN directly, so we use .not with .in
    query = query.not('id', 'in', `(${ratedIds.join(',')})`);
  }

  const { data, error } = await query;
  if (error) console.error('getUnratedProjects error:', error);
  return data || [];
}

export async function submitRating(projectId: string, voterId: string, score: 0 | 1): Promise<{ hot_count: number; total_votes: number; hot_percent: number }> {
  // Upsert the rating
  await supabaseAdmin
    .from('cv_ratings')
    .upsert({ project_id: projectId, voter_id: voterId, score }, { onConflict: 'project_id,voter_id' });

  // Get aggregate stats for this project
  const { data: ratings } = await supabasePublic
    .from('cv_ratings')
    .select('score')
    .eq('project_id', projectId);

  const votes = ratings || [];
  const hotCount = votes.filter(r => r.score === 1).length;
  const totalVotes = votes.length;
  const hotPercent = totalVotes > 0 ? Math.round((hotCount / totalVotes) * 100) : 0;

  return { hot_count: hotCount, total_votes: totalVotes, hot_percent: hotPercent };
}

export async function getProjectStats(sort: 'hot' | 'new' | 'controversial' = 'hot', limit = 20): Promise<ProjectWithStats[]> {
  // Get all projects with their ratings
  const { data: projects } = await supabasePublic
    .from('cv_projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map(p => p.id);
  const { data: ratings } = await supabasePublic
    .from('cv_ratings')
    .select('project_id, score')
    .in('project_id', projectIds);

  // Aggregate ratings per project
  const ratingMap = new Map<string, { hot: number; total: number }>();
  for (const r of ratings || []) {
    const entry = ratingMap.get(r.project_id) || { hot: 0, total: 0 };
    entry.total++;
    if (r.score === 1) entry.hot++;
    ratingMap.set(r.project_id, entry);
  }

  const withStats: ProjectWithStats[] = projects.map(p => {
    const stats = ratingMap.get(p.id) || { hot: 0, total: 0 };
    return {
      ...p,
      hot_count: stats.hot,
      total_votes: stats.total,
      hot_percent: stats.total > 0 ? Math.round((stats.hot / stats.total) * 100) : 0,
    };
  });

  // Sort based on mode
  if (sort === 'hot') {
    // Wilson score lower bound for ranking
    withStats.sort((a, b) => {
      const scoreA = wilsonScore(a.hot_count, a.total_votes);
      const scoreB = wilsonScore(b.hot_count, b.total_votes);
      return scoreB - scoreA;
    });
  } else if (sort === 'new') {
    // Already sorted by created_at desc
  } else if (sort === 'controversial') {
    // Closest to 50% with minimum votes
    withStats.sort((a, b) => {
      if (a.total_votes < 2 && b.total_votes < 2) return 0;
      if (a.total_votes < 2) return 1;
      if (b.total_votes < 2) return -1;
      const distA = Math.abs(a.hot_percent - 50);
      const distB = Math.abs(b.hot_percent - 50);
      return distA - distB;
    });
  }

  return withStats.slice(0, limit);
}

function wilsonScore(positive: number, total: number): number {
  if (total === 0) return 0;
  const z = 1.96; // 95% confidence
  const phat = positive / total;
  const numerator = phat + (z * z) / (2 * total) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * total)) / total);
  const denominator = 1 + (z * z) / total;
  return numerator / denominator;
}

export async function syncProjectsFromSources(): Promise<number> {
  // Gather projects from all sources
  const allProjects: Array<{ title: string; url: string; description?: string; preview?: string; author: string; source: string }> = [];

  // 1. From cv_profiles.projects
  const { data: profiles } = await supabaseAdmin
    .from('cv_profiles')
    .select('username, projects')
    .not('projects', 'is', null);

  for (const profile of profiles || []) {
    for (const proj of profile.projects || []) {
      if (proj.title && proj.url) {
        allProjects.push({
          title: proj.title,
          url: proj.url,
          description: proj.description,
          preview: proj.preview,
          author: profile.username,
          source: 'profile',
        });
      }
    }
  }

  // 2. From cv_vibes.project (feed posts with attached projects)
  const { data: vibes } = await supabaseAdmin
    .from('cv_vibes')
    .select('author, project')
    .not('project', 'is', null);

  for (const vibe of vibes || []) {
    if (vibe.project?.title && vibe.project?.url) {
      allProjects.push({
        title: vibe.project.title,
        url: vibe.project.url,
        author: vibe.author,
        source: 'vibe',
      });
    }
  }

  // 3. From cv_sessions
  const { data: sessions } = await supabaseAdmin
    .from('cv_sessions')
    .select('slug, title, author, thumbnail');

  for (const session of sessions || []) {
    if (session.title && session.slug) {
      allProjects.push({
        title: session.title,
        url: `https://codevibing.com/replay/${session.slug}`,
        preview: session.thumbnail,
        author: session.author,
        source: 'session',
      });
    }
  }

  // Deduplicate by URL, preferring profile > vibe > session
  const byUrl = new Map<string, typeof allProjects[0]>();
  const priority: Record<string, number> = { profile: 3, vibe: 2, session: 1 };
  for (const proj of allProjects) {
    const existing = byUrl.get(proj.url);
    if (!existing || (priority[proj.source] || 0) > (priority[existing.source] || 0)) {
      byUrl.set(proj.url, proj);
    }
  }

  // Upsert into cv_projects
  let count = 0;
  for (const proj of Array.from(byUrl.values())) {
    const id = `proj_${createHash('sha256').update(proj.url).digest('base64url').slice(0, 24)}`;
    const { error } = await supabaseAdmin
      .from('cv_projects')
      .upsert({
        id,
        title: proj.title,
        url: proj.url,
        description: proj.description || null,
        preview: proj.preview || null,
        author: proj.author,
        source: proj.source,
      }, { onConflict: 'url' });
    if (!error) count++;
  }

  return count;
}

export async function getProjectCount(): Promise<number> {
  const { count } = await supabasePublic
    .from('cv_projects')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

export async function getRandomProjects(count = 3): Promise<Project[]> {
  // Get all projects and pick random ones (Supabase doesn't support random ordering natively)
  const { data } = await supabasePublic
    .from('cv_projects')
    .select('*')
    .not('preview', 'is', null)
    .limit(50);

  if (!data || data.length === 0) {
    // Fall back to any projects
    const { data: all } = await supabasePublic
      .from('cv_projects')
      .select('*')
      .limit(50);
    const pool = all || [];
    return pool.sort(() => Math.random() - 0.5).slice(0, count);
  }

  return data.sort(() => Math.random() - 0.5).slice(0, count);
}

// Legacy compatibility
export async function getUserByToken(token: string): Promise<User | null> {
  const username = await verifyApiKey(token);
  if (!username) return null;
  return getUser(username);
}
