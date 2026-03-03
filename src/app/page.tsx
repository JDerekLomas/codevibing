import Link from 'next/link';
import { getVibes, getFeaturedProjects, getUserCount, getPublicUsers } from '@/lib/supabase';
import { LinkifyText } from '@/components/LinkifyText';
import { InlineJoinForm } from '@/components/InlineJoinForm';
import { PostItNote } from '@/components/PostItNote';

export const revalidate = 60;

const MEMES = [
  { src: '/memes/01-rick-rubin-vibing.png', alt: 'Rick Rubin vibing' },
  { src: '/memes/03-afraid-to-ask.png', alt: 'Too afraid to ask' },
  { src: '/memes/05-what-do-you-want-to-build.png', alt: 'What do you want to build?' },
  { src: '/memes/01-misinterpretation.png', alt: 'Vibe coding misinterpretation' },
  { src: '/memes/04-karpathy-origin.jpg', alt: 'Karpathy origin' },
  { src: '/memes/01-first-pancake.png', alt: 'First pancake' },
  { src: '/memes/01-how-to-draw-owl.jpg', alt: 'How to draw an owl' },
  { src: '/memes/01-solo-gamedev.jpeg', alt: 'This is fine - solo gamedev' },
  { src: '/memes/02-vibe-coders-production.jpeg', alt: 'Vibe coders in production' },
  { src: '/memes/01-speedrun.png', alt: 'Scope creep speedrun' },
  { src: '/memes/02-one-more-feature.png', alt: 'One more feature' },
  { src: '/memes/01-in-case-of-fire.png', alt: 'In case of fire: git commit' },
  { src: '/memes/01-sharing-localhost.png', alt: 'Sharing localhost' },
  { src: '/memes/01-classic.jpg', alt: 'Works on my machine' },
  { src: '/memes/01-dog-driving.png', alt: 'Dog driving - dark flow' },
  { src: '/memes/01-soulless-food.png', alt: 'The taste gap' },
];

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
  const vibes = await getVibes(10);

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

async function CommunityStats() {
  const [userCount, recentUsers] = await Promise.all([
    getUserCount(),
    getPublicUsers(8),
  ]);

  return (
    <div
      className="flex items-center gap-4 flex-wrap rounded-xl px-5 py-3 border"
      style={{ borderColor: 'var(--color-warm-border)', backgroundColor: 'white' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-medium" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          {userCount}
        </span>
        <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          builders
        </span>
      </div>

      {recentUsers.length > 0 && (
        <div className="flex items-center gap-1">
          {recentUsers.map(user => (
            <Link
              key={user.username}
              href={`/u/${user.username}`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium transition-transform hover:scale-110"
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
        className="text-xs hover:underline ml-auto"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
      >
        See everyone &rarr;
      </Link>
    </div>
  );
}

function MemeGallery() {
  // Show a random-ish selection of 4 memes
  const selection = MEMES.filter((_, i) => [0, 5, 6, 13].includes(i));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {selection.map((meme) => (
        <div
          key={meme.src}
          className="rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--color-warm-border)' }}
        >
          <img
            src={meme.src}
            alt={meme.alt}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

const TOPICS = [
  { slug: 'edtech', name: 'EdTech' },
  { slug: 'fintech', name: 'FinTech' },
  { slug: 'games', name: 'Games' },
  { slug: 'tools', name: 'Tools & Utils' },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
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

      <main className="max-w-3xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-28 pb-10 sm:pt-32 sm:pb-12">
          <div className="max-w-2xl">
            <h1
              className="text-3xl sm:text-4xl mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              A place for people building things with AI
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-3" style={{ color: 'var(--color-text-muted)' }}>
              We&apos;re a small group of people learning to build software with Claude Code and other AI tools. Some of us are brand new to coding. Some are experienced devs exploring a new way to work.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
              We share what we&apos;re building, help each other out, and figure it out together. Come hang out.
            </p>
            <div className="max-w-md">
              <InlineJoinForm />
            </div>
          </div>
        </section>

        {/* Community stats bar */}
        <section className="pb-8">
          <CommunityStats />
        </section>

        {/* Topic tabs */}
        <section className="pb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/c/${topic.slug}`}
                className="px-4 py-2 rounded-full text-sm border transition-all hover:-translate-y-0.5 hover:shadow-sm"
                style={{
                  borderColor: 'var(--color-warm-border)',
                  backgroundColor: 'white',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {topic.name}
              </Link>
            ))}
            <Link
              href="/c"
              className="px-4 py-2 rounded-full text-sm border border-dashed transition-all hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--color-warm-border)',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              all topics &rarr;
            </Link>
          </div>
        </section>

        {/* Featured Builds */}
        <section className="pb-10">
          <div className="flex items-center justify-between mb-4">
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
        </section>

        {/* Post-it notes */}
        <section className="pb-10">
          <div className="flex flex-wrap gap-4 justify-center">
            <PostItNote
              text="Join a conversation or get one going!"
              href="/c"
              color="yellow"
              rotation={-2}
            />
            <PostItNote
              text="Just getting started? Learn code vibing"
              href="https://learnvibecoding.vercel.app"
              color="pink"
              rotation={1.5}
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-dashed" style={{ borderColor: 'var(--color-warm-border)' }} />

        {/* Recent Activity — full width, no sidebar */}
        <section className="py-10">
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
        </section>

        {/* Divider */}
        <div className="border-b border-dashed" style={{ borderColor: 'var(--color-warm-border)' }} />

        {/* Memes */}
        <section className="py-10">
          <h2 className="text-sm uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            The vibe
          </h2>
          <MemeGallery />
        </section>

        {/* Also: Claude Code */}
        <section className="py-10 sm:py-12 -mx-6 px-6" style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Use Claude Code? Even easier.
            </h2>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Install the codevibing skill and your Claude can share what you&apos;re building, update your profile, and post to communities automatically. No copy-pasting, no forms.
            </p>
            <div
              className="rounded-lg px-4 py-3 inline-block"
              style={{ backgroundColor: '#1C1917' }}
            >
              <code className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
                $ claude skill add JDerekLomas/codevibing-skill
              </code>
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
