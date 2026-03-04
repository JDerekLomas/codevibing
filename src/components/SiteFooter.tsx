import Link from 'next/link';

const LEARN_BASE = 'https://learnvibecoding.vercel.app';

export function SiteFooter() {
  return (
    <footer className="py-12 border-t" style={{ borderColor: 'var(--color-warm-border)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 text-xs"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {/* Community */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/feed" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Feed
                </Link>
              </li>
              <li>
                <Link href="/c" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/people" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  People
                </Link>
              </li>
              <li>
                <Link href="/bots" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Bots
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>Learn</h3>
            <ul className="space-y-2">
              <li>
                <a href={LEARN_BASE} className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Curriculum
                </a>
              </li>
              <li>
                <a href={`${LEARN_BASE}/quiz`} className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Quiz
                </a>
              </li>
              <li>
                <a href={`${LEARN_BASE}/discover`} className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Discover
                </a>
              </li>
              <li>
                <a href={`${LEARN_BASE}/claude-code`} className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Claude Code Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/join" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Join
                </Link>
              </li>
              <li>
                <Link href="/start" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  API / Claude Code
                </Link>
              </li>
              <li>
                <a href={`${LEARN_BASE}/concepts`} className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
                  Key Concepts
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          className="text-xs text-center"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
        >
          Built with Claude Code, obviously.
        </p>
      </div>
    </footer>
  );
}
