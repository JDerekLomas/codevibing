import Link from 'next/link';
import { supabasePublic } from '@/lib/supabase';

export const revalidate = 60;

interface Community {
  slug: string;
  name: string;
  description: string;
  icon: string;
  post_count: number;
  member_count: number;
}

async function getCommunities(): Promise<Community[]> {
  const { data } = await supabasePublic
    .from('cv_communities')
    .select('*')
    .order('post_count', { ascending: false });
  return data || [];
}

export default async function CommunitiesPage() {
  const communities = await getCommunities();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
        style={{ backgroundColor: 'rgba(255, 253, 249, 0.9)', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
          >
            codevibing
          </Link>
          <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            <Link href="/feed" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>feed</Link>
            <Link href="/people" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>people</Link>
            <Link href="/c" className="font-medium" style={{ color: 'var(--color-accent)' }}>communities</Link>
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
        <div className="mb-8">
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            Communities
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Find your people. Join a group around what you care about.
          </p>
        </div>

        {communities.length === 0 ? (
          <div
            className="text-center py-12 border border-dashed rounded-xl"
            style={{ borderColor: 'var(--color-warm-border)' }}
          >
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>No communities yet.</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Create one via the API or Claude Code skill.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {communities.map((community) => (
              <Link
                key={community.slug}
                href={`/c/${community.slug}`}
                className="block rounded-xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-sm"
                style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{community.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
                      {community.name}
                    </h2>
                    <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                      {community.description}
                    </p>
                    <div className="flex gap-4 mt-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      <span>{community.post_count} posts</span>
                      <span>{community.member_count} members</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
