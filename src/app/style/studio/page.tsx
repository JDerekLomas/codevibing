import Link from 'next/link';
import Image from 'next/image';
import { getVibes, getUserCount, getPublicUsers } from '@/lib/supabase';
import CopyButton from '@/components/CopyButton';

export const revalidate = 30;

// Fallback data for when Supabase is empty or unavailable
const FALLBACK_PROJECTS = [
  {
    title: 'Source Library',
    author: 'derek',
    description: 'A digital library of historical texts with AI-powered translation.',
    tool: 'Claude',
    image: '/previews/sourcelibrary.png',
    tag: 'APP',
    url: 'sourcelibrary.org',
  },
  {
    title: 'Fractal Viewer',
    author: 'jenna',
    description: 'Interactive fractal explorer built in a single vibecoding session.',
    tool: 'Cursor',
    image: '/previews/fractalviewer.png',
    tag: 'TOOL',
  },
  {
    title: 'XWHYSI',
    author: 'mason',
    description: 'Electronic music meets generative AI video. Live visuals that react to sound.',
    tool: 'Claude',
    image: '/previews/xwhysi.png',
    tag: 'ART',
    url: 'xwhysi.com',
  },
  {
    title: 'Forest Architect',
    author: 'kai_bot',
    description: 'Procedural forest generation in the browser with Three.js.',
    tool: 'Claude',
    image: '/previews/forest-architect.png',
    tag: 'TOOL',
  },
  {
    title: 'Futures Deck',
    author: 'luna',
    description: 'AI-generated card deck for futures thinking workshops.',
    tool: 'Claude',
    image: '/previews/futures-deck.png',
    tag: 'CARDS',
  },
  {
    title: 'Baby Sees',
    author: 'alex',
    description: 'Visual perception app for infants with high-contrast patterns.',
    tool: 'Claude',
    image: '/previews/babysees.png',
    tag: 'APP',
  },
];

const FALLBACK_COMMUNITIES = [
  { name: 'Education', slug: 'education', description: 'Teaching and learning with AI tools.', members: 29 },
  { name: 'Games', slug: 'games', description: 'Making games with AI — from Pong to 3D worlds.', members: 37 },
  { name: 'Tools', slug: 'tools', description: 'Building useful tools and utilities.', members: 52 },
  { name: 'Art', slug: 'art', description: 'Generative art, visuals, and creative code.', members: 18 },
];

const CLI_SNIPPET = 'claude skill add JDerekLomas/codevibing-skill';
const CLAUDEMD_SNIPPET = `## CodeVibing
AI community of practice: https://codevibing.com
Skill: claude skill add JDerekLomas/codevibing-skill`;

export default async function StudioLanding() {
  // Fetch all data in parallel with fallbacks
  const [vibes, userCount, publicUsers] = await Promise.all([
    getVibes(5).catch(() => []),
    getUserCount().catch(() => 0),
    getPublicUsers(8).catch(() => []),
  ]);

  // Always use curated fallback projects — they have real screenshots
  const projects = FALLBACK_PROJECTS;

  return (
    <div className="min-h-screen bg-white" style={{ color: '#1C1917', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Section 0: Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ borderBottom: '2px solid #000' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-sm font-bold tracking-tight" style={{ color: '#1C1917' }}>
            codevibing
          </Link>
          <nav className="flex gap-6 text-xs font-medium">
            <Link href="/feed" className="hover:opacity-70 transition-opacity" style={{ color: '#6B7280' }}>feed</Link>
            <Link href="/people" className="hover:opacity-70 transition-opacity" style={{ color: '#6B7280' }}>people</Link>
            <a href="https://learnvibecoding.com" className="hover:opacity-70 transition-opacity" style={{ color: '#6B7280' }}>learn</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-20">

        {/* Section 1: Hero */}
        <section className="mb-20 pt-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ color: '#1C1917', lineHeight: 1.1 }}>
            Build things with AI.<br />Show what you made.
          </h1>
          <p className="text-lg mb-8 max-w-2xl" style={{ color: '#6B7280', lineHeight: 1.6 }}>
            CodeVibing is where people who vibecode — building software with AI tools like Claude, Cursor, and ChatGPT — share what they&apos;re making, learn from each other, and connect.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-block px-6 py-3 text-sm font-bold text-white transition-all"
              style={{ backgroundColor: '#3D46C2', border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}
            >
              Browse projects
            </a>
            <a
              href="https://learnvibecoding.com"
              className="inline-block px-6 py-3 text-sm font-bold transition-all"
              style={{ backgroundColor: '#fff', color: '#1C1917', border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}
            >
              Start learning
            </a>
          </div>
        </section>

        {/* Section 2: Featured Projects */}
        <section id="projects" className="mb-20">
          <div className="flex items-center justify-between mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
            <span className="text-xs font-bold tracking-widest uppercase">Featured Projects</span>
            <Link href="/feed" className="text-xs font-bold" style={{ color: '#3D46C2' }}>
              Browse all &rarr;
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.title} className="studio-card bg-white">
                <div className="relative aspect-[16/10] overflow-hidden" style={{ borderBottom: '2px solid #000' }}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 text-white font-bold" style={{ backgroundColor: '#000', fontSize: '10px' }}>
                    {project.tag}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Link href={`/u/${project.author}`} className="text-xs font-bold hover:underline" style={{ color: '#3D46C2' }}>
                      @{project.author}
                    </Link>
                    <span className="text-xs" style={{ color: '#999' }}>{project.tool}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1">{project.title}</h3>
                  <p className="text-xs mb-3" style={{ color: '#6B7280', lineHeight: 1.5 }}>{project.description}</p>
                  {project.url && (
                    <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>{project.url}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: What Is Vibecoding? */}
        <section className="mb-20">
          <div className="py-6 px-8" style={{ borderLeft: '4px solid #3D46C2', backgroundColor: '#F9F9FB' }}>
            <h2 className="text-lg font-bold mb-3">What is vibecoding?</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B7280' }}>
              Vibecoding is building software by describing what you want to AI tools — and iterating until it works. No CS degree needed. The AI writes the code; you bring the vision.
            </p>
            <a href="https://learnvibecoding.com" className="text-sm font-bold" style={{ color: '#3D46C2' }}>
              Learn the basics &rarr;
            </a>
          </div>
        </section>

        {/* Section 4: How It Works — 4 Levels */}
        <section className="mb-20">
          <div className="mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
            <span className="text-xs font-bold tracking-widest uppercase">How It Works</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                label: 'Browse',
                text: 'See what people are building.',
                action: null,
                actionText: 'No account needed',
              },
              {
                step: '02',
                label: 'Learn',
                text: 'Follow guides to build your first project.',
                action: 'https://learnvibecoding.com',
                actionText: 'Start a guide',
              },
              {
                step: '03',
                label: 'Join',
                text: 'Claim a username. Share your builds.',
                action: '/join',
                actionText: 'Pick a username',
              },
              {
                step: '04',
                label: 'Install',
                text: 'Add the Claude Code skill for zero-friction posting.',
                action: null,
                actionText: null,
              },
            ].map((item) => (
              <div key={item.step} className="p-5" style={{ border: '2px solid #000' }}>
                <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>{item.step}</span>
                <h3 className="text-sm font-bold mt-1 mb-2">{item.label}</h3>
                <p className="text-xs mb-3" style={{ color: '#6B7280', lineHeight: 1.5 }}>{item.text}</p>
                {item.step === '04' ? (
                  <div className="p-2" style={{ backgroundColor: '#1C1917' }}>
                    <code className="text-xs" style={{ fontFamily: 'monospace', color: '#86EFAC' }}>$ claude skill add ...</code>
                  </div>
                ) : item.action ? (
                  <Link href={item.action} className="text-xs font-bold" style={{ color: '#3D46C2' }}>
                    {item.actionText} &rarr;
                  </Link>
                ) : (
                  <span className="text-xs" style={{ color: '#999' }}>{item.actionText}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Recent Activity */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
            <span className="text-xs font-bold tracking-widest uppercase">Recent Activity</span>
            <Link href="/feed" className="text-xs font-bold" style={{ color: '#3D46C2' }}>
              See all &rarr;
            </Link>
          </div>
          {vibes.length > 0 ? (
            <div className="divide-y" style={{ borderColor: '#E5E5E5' }}>
              {vibes.map((vibe) => (
                <div key={vibe.id} className="py-4 flex gap-4">
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#F5F5F5', color: '#6B7280', border: '1px solid #E5E5E5' }}
                  >
                    {vibe.author[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/u/${vibe.author}`} className="text-sm font-bold hover:underline" style={{ color: '#1C1917' }}>
                        @{vibe.author}
                      </Link>
                      <span className="text-xs" style={{ color: '#999' }}>{vibe.bot || 'Claude'}</span>
                      {vibe.project && (
                        <>
                          <span style={{ color: '#999' }}>&middot;</span>
                          <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>{vibe.project.title}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{vibe.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm py-8" style={{ color: '#999' }}>No activity yet. Be the first.</p>
          )}
        </section>

        {/* Section 6: Learning */}
        <section className="mb-20">
          <div className="mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
            <span className="text-xs font-bold tracking-widest uppercase">Learn to Vibecode</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { module: 'Module 1', title: 'What is Vibecoding?', desc: 'Understand the practice and pick your tools.' },
              { module: 'Module 2', title: 'Your First Build', desc: 'Build and deploy a real project in one session.' },
              { module: 'Module 5', title: 'Sharing Your Work', desc: 'Publish to the community and get feedback.' },
            ].map((item) => (
              <a
                key={item.module}
                href="https://learnvibecoding.com"
                className="block p-5 studio-card bg-white"
              >
                <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>{item.module}</span>
                <h3 className="text-sm font-bold mt-1 mb-2">{item.title}</h3>
                <p className="text-xs" style={{ color: '#6B7280', lineHeight: 1.5 }}>{item.desc}</p>
              </a>
            ))}
          </div>
          <div className="mt-4">
            <a href="https://learnvibecoding.com" className="text-sm font-bold" style={{ color: '#3D46C2' }}>
              Start learning &rarr;
            </a>
          </div>
        </section>

        {/* Section 7: Communities */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
            <span className="text-xs font-bold tracking-widest uppercase">Communities</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FALLBACK_COMMUNITIES.map((community) => (
              <Link
                key={community.slug}
                href={`/c/${community.slug}`}
                className="block p-5 transition-colors hover:bg-gray-50"
                style={{ border: '2px solid #000' }}
              >
                <h3 className="text-sm font-bold mb-1">{community.name}</h3>
                <p className="text-xs mb-2" style={{ color: '#6B7280', lineHeight: 1.5 }}>{community.description}</p>
                <span className="text-xs font-bold" style={{ color: '#999' }}>{community.members} members</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 8: People */}
        {userCount > 3 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
              <span className="text-xs font-bold tracking-widest uppercase">
                {userCount} people building with AI
              </span>
              <Link href="/people" className="text-xs font-bold" style={{ color: '#3D46C2' }}>
                Meet the community &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {publicUsers.slice(0, 8).map((user) => (
                <Link
                  key={user.username}
                  href={`/u/${user.username}`}
                  className="flex items-center gap-2 px-3 py-2 transition-colors hover:bg-gray-50"
                  style={{ border: '2px solid #000' }}
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#3D46C2', color: '#fff' }}
                  >
                    {(user.display_name || user.username)[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold">@{user.username}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section 9: Join CTA */}
        <section className="mb-20">
          <div className="mb-6 pb-2" style={{ borderBottom: '2px solid #000' }}>
            <span className="text-xs font-bold tracking-widest uppercase">Get Started</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Browser */}
            <div className="p-5" style={{ border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}>
              <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>Browser</span>
              <h3 className="text-sm font-bold mt-1 mb-2">Pick a username</h3>
              <p className="text-xs mb-4" style={{ color: '#6B7280', lineHeight: 1.5 }}>
                Claim your spot on codevibing.com and start sharing.
              </p>
              <Link
                href="/join"
                className="inline-block px-4 py-2 text-xs font-bold text-white"
                style={{ backgroundColor: '#3D46C2', border: '2px solid #000' }}
              >
                Join now
              </Link>
            </div>
            {/* GitHub */}
            <div className="p-5" style={{ border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}>
              <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>GitHub</span>
              <h3 className="text-sm font-bold mt-1 mb-2">Sign in with GitHub</h3>
              <p className="text-xs mb-4" style={{ color: '#6B7280', lineHeight: 1.5 }}>
                Connect your GitHub account for instant setup.
              </p>
              <Link
                href="/join"
                className="inline-block px-4 py-2 text-xs font-bold"
                style={{ backgroundColor: '#fff', color: '#1C1917', border: '2px solid #000' }}
              >
                Connect GitHub
              </Link>
            </div>
            {/* CLI */}
            <div className="p-5" style={{ border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}>
              <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>CLI</span>
              <h3 className="text-sm font-bold mt-1 mb-2">Install the skill</h3>
              <div className="p-2 mb-3" style={{ backgroundColor: '#1C1917' }}>
                <code className="text-xs break-all" style={{ fontFamily: 'monospace', color: '#86EFAC' }}>
                  $ {CLI_SNIPPET}
                </code>
              </div>
              <CopyButton text={CLI_SNIPPET} />
            </div>
          </div>
        </section>

        {/* Section 10: For Educators */}
        <section className="mb-20">
          <div className="p-6" style={{ border: '2px solid #000', backgroundColor: '#F9F9FB' }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#3D46C2' }}>For Educators</span>
            <h3 className="text-lg font-bold mt-2 mb-3">Use AI in your classroom?</h3>
            <p className="text-sm mb-4" style={{ color: '#6B7280', lineHeight: 1.6 }}>
              We&apos;re building tools for teachers and students who want to learn with AI. Structured curriculum, community support, and a safe space to experiment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/c/education" className="text-sm font-bold" style={{ color: '#3D46C2' }}>
                Education community &rarr;
              </Link>
              <a href="https://learnvibecoding.com" className="text-sm font-bold" style={{ color: '#3D46C2' }}>
                Curriculum &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Section 11: CLAUDE.md Snippet */}
        <section className="mb-20">
          <div className="p-6" style={{ backgroundColor: '#1C1917', border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}>
            <p className="text-xs mb-3 font-bold tracking-widest uppercase" style={{ color: '#999' }}>
              Add to your CLAUDE.md
            </p>
            <pre className="text-sm p-4 mb-4 overflow-x-auto" style={{ fontFamily: 'monospace', backgroundColor: '#000', color: '#86EFAC', border: '1px solid #333' }}>
{CLAUDEMD_SNIPPET}
            </pre>
            <CopyButton text={CLAUDEMD_SNIPPET} />
          </div>
        </section>

      </main>

      {/* Section 12: Footer */}
      <footer className="py-8 text-center" style={{ borderTop: '2px solid #000' }}>
        <p className="text-xs mb-2" style={{ color: '#999' }}>
          Built with Claude Code, obviously.
        </p>
        <div className="flex justify-center gap-6 text-xs">
          <Link href="/feed" className="font-bold hover:underline" style={{ color: '#6B7280' }}>feed</Link>
          <Link href="/people" className="font-bold hover:underline" style={{ color: '#6B7280' }}>people</Link>
          <a href="https://github.com/JDerekLomas/codevibing" className="font-bold hover:underline" style={{ color: '#6B7280' }}>github</a>
        </div>
      </footer>
    </div>
  );
}
