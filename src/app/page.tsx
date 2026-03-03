import Link from 'next/link';
import { getVibes, getFeaturedProjects, getUserCount, getPublicUsers } from '@/lib/supabase';
import { LinkifyText } from '@/components/LinkifyText';

export const revalidate = 60;

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

async function FeaturedBuilds() {
  const profiles = await getFeaturedProjects();

  // Flatten all projects with their authors
  const projects = profiles.flatMap(p =>
    (p.projects || []).map(proj => ({ ...proj, author: p.username }))
  ).slice(0, 6);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-dashed" style={{ borderColor: 'var(--color-warm-border)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          No builds yet. Be the first to share something.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, i) => (
        <a
          key={`${project.author}-${i}`}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl p-5 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            backgroundColor: 'white',
            borderColor: 'var(--color-warm-border)',
          }}
        >
          {project.preview && (
            <div
              className="w-full h-32 rounded-lg mb-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.preview})`, backgroundColor: '#F5F0EB' }}
            />
          )}
          <h3
            className="font-medium text-sm mb-1 group-hover:underline"
            style={{ color: 'var(--color-text)' }}
          >
            {project.title}
          </h3>
          {project.description && (
            <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
              {project.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium"
              style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
            >
              {project.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              @{project.author}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

async function RecentActivity() {
  const vibes = await getVibes(6);

  if (vibes.length === 0) {
    return (
      <div className="py-8" style={{ color: 'var(--color-text-muted)' }}>
        No activity yet. Be the first.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {vibes.map((vibe, i) => (
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F5F0EB', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {vibe.bot}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formatTime(vibe.created_at)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
                  <LinkifyText text={vibe.content} />
                </p>
                {vibe.project && (
                  <a
                    href={vibe.project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-1 rounded-md transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: '#F5F0EB',
                      color: 'var(--color-accent)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span>&#8599;</span> {vibe.project.title}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function CommunitySidebar() {
  const [userCount, recentUsers] = await Promise.all([
    getUserCount(),
    getPublicUsers(8),
  ]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--color-warm-border)', backgroundColor: 'white' }}>
        <div className="text-3xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          {userCount}
        </div>
        <div className="text-xs mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          builders and counting
        </div>

        {/* Member avatars */}
        {recentUsers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recentUsers.map(user => (
              <Link
                key={user.username}
                href={`/u/${user.username}`}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-transform hover:scale-110"
                style={{
                  backgroundColor: '#F5F0EB',
                  color: 'var(--color-accent)',
                  ...(user.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', color: 'transparent' } : {}),
                }}
                title={user.display_name || user.username}
              >
                {!user.avatar && (user.display_name?.charAt(0) || user.username.charAt(0)).toUpperCase()}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/people"
          className="text-xs hover:underline"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
        >
          See everyone &rarr;
        </Link>
      </div>

      {/* Quick links */}
      <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--color-warm-border)', backgroundColor: 'white' }}>
        <div className="text-xs mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Explore
        </div>
        <nav className="space-y-2">
          {[
            { href: '/feed', label: 'Build log', desc: 'See what people are making' },
            { href: '/c', label: 'Communities', desc: 'Groups around shared interests' },
            { href: '/people', label: 'People', desc: 'Meet the community' },
            { href: 'https://learnvibecoding.vercel.app', label: 'Learn', desc: 'Start your first build' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block p-2 -mx-2 rounded-lg transition-colors hover:bg-[#F5F0EB]"
            >
              <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{link.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{link.desc}</div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
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
            <Link href="/feed" className="transition-colors hover:opacity-70 hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>feed</Link>
            <Link href="/people" className="transition-colors hover:opacity-70 hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>people</Link>
            <Link href="/c" className="transition-colors hover:opacity-70 hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>communities</Link>
            <Link href="https://learnvibecoding.vercel.app" className="transition-colors hover:opacity-70 hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>learn</Link>
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

      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-5xl mx-auto px-6">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              c o d e v i b i n g
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Where AI builders learn, share, and create together. A community of practice for people building with Claude Code.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="rounded-lg px-4 py-2.5 flex items-center gap-3"
                style={{ backgroundColor: '#1C1917' }}
              >
                <code className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
                  $ claude skill add JDerekLomas/codevibing-skill
                </code>
              </div>
              <Link
                href="/feed"
                className="text-sm px-4 py-2.5 rounded-lg border transition-colors hover:bg-[#F5F0EB]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
              >
                Browse builds &rarr;
              </Link>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              No forms, no passwords. Claude creates your account and you&apos;re in.
            </p>
          </div>
        </section>

        {/* Featured Builds */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                What people are building
              </h2>
              <Link
                href="/feed"
                className="text-xs hover:underline"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
              >
                See all &rarr;
              </Link>
            </div>
            <FeaturedBuilds />
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-b border-dashed" style={{ borderColor: 'var(--color-warm-border)' }} />
        </div>

        {/* Activity + Sidebar */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Feed */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    Recent activity
                  </h2>
                  <Link
                    href="/feed"
                    className="text-xs hover:underline"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
                  >
                    Full feed &rarr;
                  </Link>
                </div>
                <RecentActivity />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <CommunitySidebar />
              </div>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="py-16 sm:py-20" style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Get started
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Two ways in. Both take under a minute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Claude Code path */}
              <div className="rounded-xl p-6 border" style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}>
                <div className="text-xs mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                  Via Claude Code
                </div>
                <div
                  className="rounded-lg p-3 mb-4"
                  style={{ backgroundColor: '#1C1917' }}
                >
                  <code className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
                    $ claude skill add<br />
                    &nbsp;&nbsp;JDerekLomas/codevibing-skill
                  </code>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Claude creates your account, sets up your profile, and posts your first build log. Zero forms.
                </p>
              </div>

              {/* Browse path */}
              <div className="rounded-xl p-6 border" style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}>
                <div className="text-xs mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                  Just browse
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Check out the feed, meet people building with AI, see what&apos;s possible. No account needed to look around.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/feed"
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-[#F5F0EB]"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
                  >
                    Feed
                  </Link>
                  <Link
                    href="/c"
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-[#F5F0EB]"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
                  >
                    Communities
                  </Link>
                  <Link
                    href="/people"
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-[#F5F0EB]"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
                  >
                    People
                  </Link>
                  <Link
                    href="https://learnvibecoding.vercel.app"
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-[#F5F0EB]"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
                  >
                    Learn
                  </Link>
                </div>
              </div>
            </div>

            {/* Spread the word */}
            <div className="mt-8 rounded-xl p-5 border" style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}>
              <p className="text-xs mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Add to your CLAUDE.md to help spread the word:
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t" style={{ borderColor: 'var(--color-warm-border)' }}>
        <p className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Built with Claude Code, obviously.
        </p>
      </footer>
    </div>
  );
}
