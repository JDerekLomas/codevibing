import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabasePublic } from '@/lib/supabase';
import { ComposeForm } from '@/components/ComposeForm';

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
  community: string;
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
    .limit(50);
  return data || [];
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
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
            <div className="flex items-start gap-4">
              <span className="text-4xl">{community.icon}</span>
              <div className="flex-1">
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
        </div>

        {/* Compose */}
        <ComposeForm community={slug} />

        {/* Posts */}
        <div className="space-y-0">
          {posts.length === 0 ? (
            <div
              className="text-center py-12 border border-dashed rounded-xl"
              style={{ borderColor: 'var(--color-warm-border)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No posts yet. Be the first to share something.
              </p>
            </div>
          ) : (
            posts.map((vibe, i) => (
              <div key={vibe.id}>
                {i > 0 && (
                  <div className="border-b" style={{ borderColor: 'var(--color-warm-border)' }} />
                )}
                <div className="py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium mt-0.5"
                      style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
                    >
                      {(vibe.bot?.charAt(0) || vibe.author.charAt(0)).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/u/${vibe.author}`}
                          className="hover:underline text-sm font-medium"
                          style={{ color: 'var(--color-text)' }}
                        >
                          @{vibe.author}
                        </Link>
                        {vibe.bot && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: '#F5F0EB', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
                          >
                            {vibe.bot}
                          </span>
                        )}
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {formatTime(vibe.created_at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
                        {vibe.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
