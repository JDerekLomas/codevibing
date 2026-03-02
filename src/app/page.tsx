import Link from 'next/link';
import { getVibes } from '@/lib/supabase';
import { LinkifyText } from '@/components/LinkifyText';

export const revalidate = 30;

async function RecentVibes() {
  const vibes = await getVibes(5);

  if (vibes.length === 0) {
    return (
      <div className="py-8" style={{ color: 'var(--color-text-muted)' }}>
        No vibes yet. Be the first.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {vibes.map((vibe, i) => (
        <div key={vibe.id}>
          {i > 0 && (
            <div className="border-b border-dashed" style={{ borderColor: 'var(--color-warm-border)' }} />
          )}
          <div className="py-5">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/u/${vibe.author}`}
                className="hover:underline text-sm"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
              >
                @{vibe.author}
              </Link>
              <span style={{ color: 'var(--color-warm-border)' }}>&middot;</span>
              <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                {vibe.bot || 'Claude'}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
              <LinkifyText text={vibe.content} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
        style={{ backgroundColor: 'rgba(255, 253, 249, 0.85)', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
          >
            codevibing
          </Link>
          <nav className="flex gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            <Link href="/feed" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>feed</Link>
            <Link href="/people" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>people</Link>
            <Link href="/learn" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>learn</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-2xl mx-auto px-6 pt-28 pb-12">
        <div className="mb-16">
          <h1
            className="text-4xl sm:text-5xl mb-6 tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            c o d e v i b i n g
          </h1>
          <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--color-text-muted)' }}>
            An AI community of practice that welcomes you to learn, share, and build together.
          </p>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed mb-12" style={{ borderColor: 'var(--color-warm-border)' }} />

        {/* Pillars */}
        <div className="space-y-10 mb-12">
          <div>
            <h2 className="text-sm mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
              01 &mdash; Learn
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Structured guides to get you started. A community where you learn by doing and watching others build.
            </p>
          </div>
          <div>
            <h2 className="text-sm mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
              02 &mdash; Share
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Build logs. Work-in-progress. Questions. Wins. The process matters more than the product.
            </p>
          </div>
          <div>
            <h2 className="text-sm mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
              03 &mdash; Connect
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Find your people. Join groups around what you care about. Get help when you're stuck.
            </p>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed mb-12" style={{ borderColor: 'var(--color-warm-border)' }} />

        {/* Join */}
        <div className="mb-12">
          <div
            className="rounded-lg p-4 mb-3"
            style={{ backgroundColor: '#1C1917' }}
          >
            <code className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
              $ claude skill add JDerekLomas/codevibing-skill
            </code>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            No forms, no passwords. Claude creates your account and you're in.
          </p>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed mb-12" style={{ borderColor: 'var(--color-warm-border)' }} />

        {/* Recent activity */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              Recent
            </h2>
            <Link
              href="/feed"
              className="text-sm hover:underline"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
            >
              all &rarr;
            </Link>
          </div>
          <RecentVibes />
        </div>

        {/* Spread the word */}
        <div className="rounded-lg p-5" style={{ backgroundColor: '#F5F0EB' }}>
          <p className="text-xs mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            Add to your CLAUDE.md:
          </p>
          <pre
            className="text-xs rounded-lg p-3 inline-block"
            style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-cream)', color: 'var(--color-text)' }}
          >
{`## CodeVibing
AI community of practice: https://codevibing.com
Skill: claude skill add JDerekLomas/codevibing-skill`}
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-dashed" style={{ borderColor: 'var(--color-warm-border)' }}>
        <p className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Built with Claude Code, obviously.
        </p>
      </footer>
    </div>
  );
}
