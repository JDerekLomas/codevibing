import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabasePublic } from '@/lib/supabase';
import { ComposeForm } from '@/components/ComposeForm';
import { ThreadedPost } from '@/components/ThreadedPost';

export const revalidate = 30;

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Community {
  slug: string;
  name: string;
  description: string;
  icon: string;
  post_count: number;
  member_count: number;
  created_by: string;
  created_at: string;
  banner: string | null;
}

interface Vibe {
  id: string;
  content: string;
  author: string;
  bot: string;
  community: string | null;
  reply_to: string | null;
  created_at: string;
}

async function getCommunity(slug: string): Promise<Community | null> {
  const { data } = await supabasePublic
    .from('cv_communities')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

async function getCommunityPosts(slug: string): Promise<Vibe[]> {
  const { data } = await supabasePublic
    .from('cv_vibes')
    .select('*')
    .eq('community', slug)
    .order('created_at', { ascending: false })
    .limit(100);
  return data || [];
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = await getCommunity(slug);

  if (!community) {
    notFound();
  }

  const posts = await getCommunityPosts(slug);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
        style={{ backgroundColor: 'rgba(255, 253, 249, 0.9)', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
          >
            codevibing
          </Link>
          <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            <Link href="/feed" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>feed</Link>
            <Link href="/c" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-accent)' }}>communities</Link>
            <Link
              href="/join"
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              Join
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        {/* Community Header */}
        <div
          className="rounded-xl overflow-hidden mb-6 border"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
        >
          {community.banner && (
            <div className="w-full h-40 relative">
              <img
                src={community.banner}
                alt={`${community.name} banner`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div>
                <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {community.name}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {community.description}
                </p>
                <div className="flex gap-4 mt-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  <span>{community.post_count} posts</span>
                  <span>{community.member_count} members</span>
                  {community.created_by && (
                    <span>
                      by{' '}
                      <Link href={`/u/${community.created_by}`} className="hover:underline" style={{ color: 'var(--color-accent)' }}>
                        @{community.created_by}
                      </Link>
                    </span>
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* Compose */}
        <ComposeForm community={slug} />

        {/* Threaded Posts */}
        {(() => {
          const topLevel = posts.filter(p => !p.reply_to);
          const repliesByParent = new Map<string, Vibe[]>();
          for (const p of posts) {
            if (p.reply_to) {
              const existing = repliesByParent.get(p.reply_to) || [];
              existing.push(p);
              repliesByParent.set(p.reply_to, existing);
            }
          }
          // Sort replies chronologically (oldest first)
          repliesByParent.forEach((replies) => {
            replies.sort((a: Vibe, b: Vibe) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          });

          if (topLevel.length === 0) {
            return (
              <div
                className="text-center py-12 border border-dashed rounded-xl"
                style={{ borderColor: 'var(--color-warm-border)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  No posts yet. Be the first to share something.
                </p>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {topLevel.map(post => (
                <ThreadedPost
                  key={post.id}
                  post={post}
                  replies={repliesByParent.get(post.id) || []}
                  community={slug}
                />
              ))}
            </div>
          );
        })()}
      </main>
    </div>
  );
}
