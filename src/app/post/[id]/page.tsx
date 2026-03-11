import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getVibe, getVibeReplies, getReactionCounts, getAllSessions } from '@/lib/supabase';
import { ThreadedPost } from '@/components/ThreadedPost';

export const revalidate = 30;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vibe = await getVibe(id);
  if (!vibe) return { title: 'Post not found' };

  const title = vibe.content.slice(0, 80) + (vibe.content.length > 80 ? '...' : '');
  const description = `@${vibe.author} on codevibing`;

  const ogParams = new URLSearchParams({
    type: 'post',
    title: vibe.content.slice(0, 150),
    username: vibe.author,
  });

  return {
    title: `@${vibe.author}: ${title}`,
    description,
    openGraph: {
      title: `@${vibe.author}: ${title}`,
      description,
      type: 'article',
      images: [{ url: `/api/og/image?${ogParams}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `@${vibe.author}: ${title}`,
      description,
      images: [`/api/og/image?${ogParams}`],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const [vibe, replies, sessions] = await Promise.all([
    getVibe(id),
    getVibeReplies(id),
    getAllSessions(),
  ]);

  if (!vibe) notFound();

  const reactions = await getReactionCounts([vibe.id]);
  const r = reactions.get(vibe.id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <Link
          href={vibe.community ? `/feed?topic=${vibe.community}` : '/feed'}
          className="inline-flex items-center gap-1 text-xs mb-6 transition-colors hover:opacity-70"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
        >
          &larr; Back to feed
        </Link>

        <ThreadedPost
          post={vibe}
          replies={replies}
          community={vibe.community || undefined}
          heartCount={r?.count || 0}
          hearted={r?.reacted || false}
          sessions={sessions}
        />
      </main>
    </div>
  );
}
