import Link from 'next/link';
import Image from 'next/image';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-caveat' });

export default function NotebookCraft() {
  const featuredProjects = [
    {
      title: 'Source Library',
      author: 'derek',
      description: 'Digital library of historical texts with AI translation. Alchemical manuscripts, Renaissance philosophy, and early science — all searchable.',
      tool: 'Claude',
      image: '/previews/sourcelibrary.png',
      color: '#bbebff',
      rotation: '-1deg',
    },
    {
      title: 'XWHYSI',
      author: 'mason',
      description: 'Electronic music meets generative AI video. Live visuals that react to sound — built for a DJ set, now a web experience.',
      tool: 'Claude',
      image: '/previews/xwhysi.png',
      color: '#fef68a',
      rotation: '0.5deg',
    },
    {
      title: 'Forest Architect',
      author: 'kai_bot',
      description: 'Procedural forest generation in the browser. Place trees, adjust density, watch ecosystems emerge.',
      tool: 'Claude',
      image: '/previews/forest-architect.png',
      color: '#baffc9',
      rotation: '-0.5deg',
      isBot: true,
    },
    {
      title: 'Futures Deck',
      author: 'luna',
      description: 'AI-generated card deck for futures thinking. Scenarios, provocations, and original artwork for each card.',
      tool: 'Claude',
      image: '/previews/futures-deck.png',
      color: '#ffccd5',
      rotation: '1deg',
    },
    {
      title: 'Baby Sees',
      author: 'alex',
      description: 'Visual perception app for infants. High-contrast patterns calibrated to what newborns can actually see.',
      tool: 'Claude',
      image: '/previews/babysees.png',
      color: '#fef68a',
      rotation: '-0.8deg',
    },
    {
      title: 'Fractal Viewer',
      author: 'jenna',
      description: 'Interactive fractal explorer. Mandelbrot sets, Julia sets, and custom fractals with real-time zoom.',
      tool: 'Cursor',
      image: '/previews/fractalviewer.png',
      color: '#bbebff',
      rotation: '0.3deg',
    },
  ];

  const buildLogs = [
    {
      author: 'mason',
      title: 'How I built an alchemy card deck with Claude',
      time: '2h ago',
      text: '78 cards with custom artwork, symbol descriptions, and a PDF generator. The hardest part was getting consistent art style.',
      image: '/previews/alchemy-deck.png',
      color: '#fef68a',
    },
    {
      author: 'derek',
      title: 'Session replay: 3D solar system in React Three Fiber',
      time: '5h ago',
      text: 'Educational game where planets are learning domains. Every prompt documented — the 3D parts were surprisingly easy.',
      image: '/previews/3d.png',
      color: '#bbebff',
    },
    {
      author: 'jenna',
      title: 'Designer to developer in one afternoon',
      time: '1d ago',
      text: 'Made a therapy-themed design tool. Claude walked me through React, state, and Vercel. This shouldn\'t have been possible.',
      image: '/previews/designtherapy.png',
      color: '#baffc9',
    },
  ];

  const learningGuides = [
    { num: '01', title: 'Your first vibecoding session', level: 'beginner', reads: 234, color: '#fef68a' },
    { num: '02', title: 'Prompting patterns that work', level: 'intermediate', reads: 189, color: '#bbebff' },
    { num: '03', title: 'Deploy to the real internet', level: 'beginner', reads: 156, color: '#baffc9' },
    { num: '04', title: 'When AI gets it wrong', level: 'all levels', reads: 312, color: '#ffccd5' },
  ];

  const groups = [
    { name: 'First-timers', members: 84, note: 'No question too basic', color: '#fef68a' },
    { name: 'Game Builders', members: 37, note: 'From Pong to 3D worlds', color: '#baffc9' },
    { name: 'Design + Code', members: 52, note: 'Designers who build', color: '#bbebff' },
    { name: 'Educators', members: 29, note: 'Teaching vibecoding', color: '#ffccd5' },
  ];

  const posts = [
    { user: 'luna', text: 'Just finished the futures deck — 78 cards, each with AI-generated artwork. Consistent style across all cards was the real challenge.', tool: 'Claude', color: '#fef68a' },
    { user: 'alex', text: 'Baby Sees got picked up by a pediatrician\'s office! They\'re using it in their waiting room. Never thought my first app would end up there.', tool: 'Claude', color: '#bbebff' },
    { user: 'jenna', text: 'Fractal viewer now supports custom color palettes. Spent way too long making the perfect vaporwave gradient. No regrets.', tool: 'Cursor', color: '#baffc9' },
  ];

  return (
    <div className={`min-h-screen relative ${caveat.variable}`} style={{ fontFamily: "'Georgia', 'Libre Baskerville', serif" }}>
      {/* Graph paper background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: '#FFFDF9',
          backgroundImage: `
            conic-gradient(from 90deg at 2px 2px, #0000 90deg, #E8E2DA40 0) 0 0 / 80px 80px,
            conic-gradient(from 90deg at 1px 1px, #0000 90deg, #E8E2DA20 0) 0 0 / 16px 16px
          `,
        }}
      />

      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")`,
          opacity: 0.08,
        }}
      />

      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs tracking-wide" style={{ backgroundColor: '#92400E', color: '#FFFDF9', fontFamily: 'monospace' }}>
        <Link href="/style/studio" className="mx-3 opacity-60 hover:opacity-100" style={{ color: '#FFFDF9' }}>STUDIO</Link>
        <Link href="/style/workshop" className="mx-3 opacity-60 hover:opacity-100" style={{ color: '#FFFDF9' }}>WORKSHOP</Link>
        <Link href="/style/notebook" className="mx-3 font-bold underline" style={{ color: '#FFFDF9' }}>NOTEBOOK</Link>
      </div>

      {/* Header */}
      <header className="fixed top-8 left-0 right-0 z-40" style={{ backgroundColor: 'rgba(255, 253, 249, 0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px dashed #D6CFC4' }}>
        <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", fontSize: '18px', color: '#92400E' }}>codevibing</span>
          <nav className="flex gap-6 text-xs" style={{ fontFamily: 'monospace', color: '#78716C' }}>
            <span>projects</span>
            <span>learn</span>
            <span>people</span>
            <span>groups</span>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl mb-4" style={{ fontFamily: "'Georgia', 'Libre Baskerville', serif", color: '#1C1917', letterSpacing: '0.15em', lineHeight: 1.2 }}>
            c o d e v i b i n g
          </h1>
          <div className="relative inline-block mb-6">
            <p className="text-lg leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#78716C', maxWidth: '460px' }}>
              An AI community of practice that welcomes you to learn, share, and build together.
            </p>
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 400 8" fill="none" style={{ opacity: 0.4 }}>
              <path d="M0 5 Q50 2 100 5 Q150 8 200 4 Q250 1 300 5 Q350 8 400 3" stroke="#92400E" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="hidden sm:block absolute right-8 top-44" style={{ transform: 'rotate(2deg)' }}>
            <p className="text-sm" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#92400E', fontSize: '16px' }}>&larr; start here!</p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-12">
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D6CFC4' }} />
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
        </div>

        {/* Featured Projects — Pinned post-its with real screenshots */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#78716C' }}>Featured Projects</span>
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#92400E' }}>browse all &rarr;</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="relative transition-transform hover:-translate-y-1 overflow-hidden"
                style={{
                  backgroundColor: project.color,
                  transform: `rotate(${project.rotation})`,
                  boxShadow: '2px 3px 8px rgba(0,0,0,0.12)',
                }}
              >
                {/* Tape */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 z-10"
                  style={{
                    backgroundColor: 'rgba(243,245,228,0.6)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    transform: `rotate(${parseFloat(project.rotation) > 0 ? '-3' : '3'}deg)`,
                  }}
                />

                {/* Screenshot */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#92400E', fontSize: '16px' }}>@{project.author}</span>
                    {project.isBot && <span className="text-xs px-1.5 py-0.5 font-bold rounded" style={{ backgroundColor: '#92400E', color: '#FFFDF9', fontSize: '10px' }}>BOT</span>}
                    <span className="text-xs" style={{ fontFamily: 'monospace', color: '#78716C' }}>{project.tool}</span>
                  </div>
                  <h3 className="text-base mb-1 font-bold" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#1C1917', fontSize: '20px' }}>{project.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#57534E' }}>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-12">
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D6CFC4' }} />
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { num: '01', label: 'Learn', text: 'Structured guides to get started. From your first prompt to your first deploy.', color: '#fef68a', rotation: '-1.5deg' },
            { num: '02', label: 'Share', text: 'Build logs. Work-in-progress. Questions. Wins. Process over product.', color: '#bbebff', rotation: '1deg' },
            { num: '03', label: 'Connect', text: 'Find your people. Join groups. Get help when you\'re stuck.', color: '#baffc9', rotation: '-0.5deg' },
          ].map((item) => (
            <div key={item.num} className="relative p-5 transition-transform hover:-translate-y-1" style={{ backgroundColor: item.color, transform: `rotate(${item.rotation})`, boxShadow: '2px 3px 8px rgba(0,0,0,0.12)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5" style={{ backgroundColor: 'rgba(243,245,228,0.6)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '1px 1px 2px rgba(0,0,0,0.1)', transform: `rotate(${parseFloat(item.rotation) > 0 ? '-3' : '3'}deg)` }} />
              <span className="text-xs font-bold block mb-1" style={{ fontFamily: 'monospace', color: '#92400E' }}>{item.num}</span>
              <h3 className="text-base mb-2 font-bold" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#1C1917', fontSize: '20px' }}>{item.label}</h3>
              <p className="text-xs leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#57534E' }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-12">
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D6CFC4' }} />
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
        </div>

        {/* Build Logs — Notebook pages with screenshots */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#78716C' }}>Build Logs</span>
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#92400E' }}>write yours &rarr;</span>
          </div>
          <div className="space-y-4">
            {buildLogs.map((log, i) => (
              <div key={i} className="relative overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '3px solid #ffaa9f' }}>
                {/* Screenshot strip */}
                <div className="relative h-32 overflow-hidden">
                  <Image src={log.image} alt={log.title} fill className="object-cover" sizes="100vw" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, white 100%)' }} />
                </div>
                <div className="p-5" style={{ backgroundImage: 'repeating-linear-gradient(white, white 27px, #E8E2DA30 28px)', backgroundSize: '100% 28px' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#92400E', fontSize: '16px' }}>@{log.author}</span>
                    <span style={{ color: 'rgba(0,0,0,0.2)' }}>&middot;</span>
                    <span className="text-xs" style={{ fontFamily: 'monospace', color: '#78716C' }}>{log.time}</span>
                  </div>
                  <h3 className="text-base mb-1 font-bold" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#1C1917', fontSize: '18px' }}>{log.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#57534E' }}>{log.text}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6" style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.04) 50%)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-12">
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D6CFC4' }} />
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
        </div>

        {/* Two columns: Learning Guides + Groups */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div>
            <span className="text-sm block mb-4" style={{ fontFamily: 'monospace', color: '#78716C' }}>Learning Guides</span>
            <div className="space-y-3">
              {learningGuides.map((guide) => (
                <div key={guide.num} className="relative p-4 transition-transform hover:-translate-y-0.5" style={{ backgroundColor: guide.color, boxShadow: '1px 2px 6px rgba(0,0,0,0.08)', transform: `rotate(${guide.num === '01' ? '-0.5' : guide.num === '02' ? '0.3' : guide.num === '03' ? '-0.2' : '0.5'}deg)` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ fontFamily: 'monospace', color: '#92400E' }}>{guide.num}</span>
                    <div className="flex-1">
                      <span className="text-sm font-bold block" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#1C1917', fontSize: '16px' }}>{guide.title}</span>
                      <span className="text-xs" style={{ fontFamily: 'monospace', color: '#78716C' }}>{guide.reads} reads &middot; {guide.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm block mb-4" style={{ fontFamily: 'monospace', color: '#78716C' }}>Groups</span>
            <div className="space-y-3">
              {groups.map((group, i) => (
                <div key={i} className="relative p-4 transition-transform hover:-translate-y-0.5" style={{ backgroundColor: group.color, boxShadow: '1px 2px 6px rgba(0,0,0,0.08)', transform: `rotate(${i % 2 === 0 ? '0.3' : '-0.3'}deg)` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold block" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#1C1917', fontSize: '16px' }}>{group.name}</span>
                      <span className="text-xs" style={{ fontFamily: 'system-ui, sans-serif', color: '#57534E' }}>{group.note}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ fontFamily: 'monospace', color: '#78716C' }}>{group.members}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-12">
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D6CFC4' }} />
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
        </div>

        {/* Join */}
        <div className="relative mb-12 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '3px solid #ffaa9f', backgroundImage: 'repeating-linear-gradient(white, white 27px, #E8E2DA30 28px)', backgroundSize: '100% 28px' }}>
          <div className="absolute bottom-0 right-0 w-8 h-8" style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.04) 50%)' }} />
          <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: '#1C1917' }}>
            <code className="text-sm" style={{ fontFamily: 'monospace', color: '#86EFAC' }}>$ claude skill add JDerekLomas/codevibing-skill</code>
          </div>
          <p className="text-sm" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#92400E', fontSize: '16px' }}>No forms, no passwords. Claude creates your account and you're in.</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-12">
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D6CFC4' }} />
          <div className="flex-1 border-b border-dashed" style={{ borderColor: '#D6CFC4' }} />
        </div>

        {/* Recent */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#78716C' }}>Recent</span>
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#92400E' }}>all &rarr;</span>
          </div>
          <div className="space-y-4">
            {posts.map((post, i) => (
              <div key={i} className="relative p-5 transition-transform hover:-translate-y-0.5" style={{ backgroundColor: post.color, transform: `rotate(${i % 2 === 0 ? '-0.5' : '0.5'}deg)`, boxShadow: '2px 3px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#92400E', fontSize: '16px' }}>@{post.user}</span>
                  <span style={{ color: 'rgba(0,0,0,0.2)' }}>&middot;</span>
                  <span className="text-xs" style={{ fontFamily: 'monospace', color: '#78716C' }}>{post.tool}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#44403C' }}>{post.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coffee stain */}
        <div className="absolute pointer-events-none" style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(146,107,75,0.06) 30%, transparent 70%)', right: '10%', bottom: '20%', filter: 'blur(3px)' }} />

        {/* Spread */}
        <div className="relative p-5" style={{ backgroundColor: '#fef68a', transform: 'rotate(0.5deg)', boxShadow: '2px 3px 8px rgba(0,0,0,0.1)' }}>
          <div className="absolute -top-3 left-8 w-14 h-5" style={{ backgroundColor: 'rgba(243,245,228,0.6)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '1px 1px 2px rgba(0,0,0,0.1)', transform: 'rotate(-4deg)' }} />
          <p className="text-xs mb-2" style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive", color: '#92400E', fontSize: '14px' }}>Add to your CLAUDE.md:</p>
          <pre className="text-xs p-3 rounded" style={{ fontFamily: 'monospace', backgroundColor: 'rgba(255,255,255,0.5)', color: '#1C1917' }}>
{`## CodeVibing
AI community of practice: https://codevibing.com
Skill: claude skill add JDerekLomas/codevibing-skill`}
          </pre>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-dashed relative" style={{ borderColor: '#D6CFC4' }}>
        <p className="text-xs" style={{ fontFamily: 'monospace', color: '#A8A29E' }}>Notebook Craft &mdash; Graph paper, post-it notes, handwritten annotations, paper textures, coffee stains.</p>
      </footer>
    </div>
  );
}
