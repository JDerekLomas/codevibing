import Link from 'next/link';
import { getVibes, getCommunities, getReactionCounts } from '@/lib/supabase';
import { ComposeForm } from '@/components/ComposeForm';
import { ThreadedPost } from '@/components/ThreadedPost';
import { TopicFilter } from '@/components/TopicFilter';

export const revalidate = 30;

interface Vibe {
  id: string;
  content: string;
  author: string;
  bot: string;
  community: string | null;
  reply_to: string | null;
  project?: { title: string; url: string; preview?: string; description?: string } | null;
  created_at: string;
}

export default async function FeedPage({ searchParams }: { searchParams: Promise<{ topic?: string; compose?: string; text?: string }> }) {
  const { topic, compose, text } = await searchParams;

  const [allVibes, communities] = await Promise.all([
    getVibes(100, undefined, topic || undefined) as Promise<Vibe[]>,
    getCommunities(),
  ]);

  // Separate top-level posts and replies
  const topLevel = allVibes.filter(v => !v.reply_to);
  const repliesByParent = new Map<string, Vibe[]>();
  for (const v of allVibes) {
    if (v.reply_to) {
      const existing = repliesByParent.get(v.reply_to) || [];
      existing.push(v);
      repliesByParent.set(v.reply_to, existing);
    }
  }
  // Sort replies oldest first
  repliesByParent.forEach(replies => {
    replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  });

  // Get reaction counts for top-level posts
  const topIds = topLevel.map(v => v.id);
  const reactions = await getReactionCounts(topIds);

  // Build community name lookup
  const communityNames = new Map(communities.map(c => [c.slug, c.name]));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-6">
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            Feed
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Everything happening in the community
          </p>
        </div>

        {/* Topic filter chips */}
        <TopicFilter communities={communities} activeTopic={topic || null} />

        {/* Compose */}
        <ComposeForm community={topic} initialText={text} autoFocus={compose === 'true'} />

        {/* Posts */}
        {topLevel.length === 0 ? (
          <div
            className="text-center py-12 border border-dashed rounded-xl"
            style={{ borderColor: 'var(--color-warm-border)' }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              {topic ? `No posts in ${communityNames.get(topic) || topic} yet.` : 'No posts yet.'}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topLevel.map(post => {
              const r = reactions.get(post.id);
              return (
                <div key={post.id}>
                  {/* Community tag */}
                  {!topic && post.community && (
                    <Link
                      href={`/feed?topic=${post.community}`}
                      className="inline-block mb-1.5 text-[10px] px-2 py-0.5 rounded-full transition-colors hover:opacity-70"
                      style={{
                        backgroundColor: '#F5F0EB',
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {communityNames.get(post.community) || post.community}
                    </Link>
                  )}
                  <ThreadedPost
                    post={post}
                    replies={repliesByParent.get(post.id) || []}
                    community={post.community || undefined}
                    heartCount={r?.count || 0}
                    hearted={r?.reacted || false}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="py-12 text-center border-t" style={{ borderColor: 'var(--color-warm-border)' }}>
        <p className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Built with Claude Code, obviously.
        </p>
      </footer>
    </div>
  );
}
