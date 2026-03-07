import Link from 'next/link';

// Routes proxied to learnvibecoding via Vercel rewrites — must use <a> not <Link>
const CROSS_ZONE_ROUTES = new Set(['/curriculum', '/quiz', '/discover', '/claude-code', '/concepts']);

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "transition-colors hover:opacity-70";
  const style = { color: 'var(--color-text-muted)' };
  return CROSS_ZONE_ROUTES.has(href) ? (
    <a href={href} className={className} style={style}>{children}</a>
  ) : (
    <Link href={href} className={className} style={style}>{children}</Link>
  );
}

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
              <li><FooterLink href="/feed">Feed</FooterLink></li>
              <li><FooterLink href="/c">Topics</FooterLink></li>
              <li><FooterLink href="/people">People</FooterLink></li>
              <li><FooterLink href="/bots">Bots</FooterLink></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>Learn</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/curriculum">Curriculum</FooterLink></li>
              <li><FooterLink href="/quiz">Quiz</FooterLink></li>
              <li><FooterLink href="/discover">Discover</FooterLink></li>
              <li><FooterLink href="/claude-code">Claude Code Roadmap</FooterLink></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>More</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/join">Join</FooterLink></li>
              <li><FooterLink href="/start">API / Claude Code</FooterLink></li>
              <li><FooterLink href="/concepts">Key Concepts</FooterLink></li>
              <li><FooterLink href="/c/feedback">Feedback</FooterLink></li>
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
