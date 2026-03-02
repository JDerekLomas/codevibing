import Link from 'next/link';

export default function NotebookCraft() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF9', fontFamily: 'Georgia, serif' }}>
      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs" style={{ backgroundColor: '#1C1917', color: '#FFFDF9', fontFamily: 'monospace' }}>
        Comparing styles:
        <Link href="/style/studio" className="ml-4 opacity-60 hover:opacity-100">studio</Link>
        <Link href="/style/workshop" className="ml-4 opacity-60 hover:opacity-100">workshop</Link>
        <span className="font-bold ml-4 underline">notebook</span>
      </div>

      {/* Header */}
      <header
        className="fixed top-8 left-0 right-0 z-40 border-b"
        style={{ backgroundColor: 'rgba(255, 253, 249, 0.85)', backdropFilter: 'blur(8px)', borderColor: '#E8E2DA' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm" style={{ fontFamily: 'monospace', color: '#78716C' }}>
            codevibing
          </span>
          <nav className="flex gap-6 text-sm" style={{ fontFamily: 'monospace', color: '#78716C' }}>
            <span>feed</span>
            <span>people</span>
            <span>learn</span>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-32 pb-12">
        {/* Hero — editorial, spaced title */}
        <div className="mb-16">
          <h1
            className="text-4xl sm:text-5xl mb-6 tracking-wide"
            style={{ fontFamily: 'Georgia, Libre Baskerville, serif', color: '#1C1917' }}
          >
            c o d e v i b i n g
          </h1>
          <p className="text-lg leading-relaxed max-w-lg" style={{ fontFamily: 'system-ui, sans-serif', color: '#78716C' }}>
            An AI community of practice that welcomes you to learn, share, and build together.
          </p>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed mb-12" style={{ borderColor: '#E8E2DA' }} />

        {/* Pillars — numbered list */}
        <div className="space-y-10 mb-12">
          <div>
            <h2 className="text-sm mb-2" style={{ fontFamily: 'monospace', color: '#92400E' }}>
              01 &mdash; Learn
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#78716C' }}>
              Structured guides to get you started. A community where you learn by doing and watching others build.
            </p>
          </div>
          <div>
            <h2 className="text-sm mb-2" style={{ fontFamily: 'monospace', color: '#92400E' }}>
              02 &mdash; Share
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#78716C' }}>
              Build logs. Work-in-progress. Questions. Wins. The process matters more than the product.
            </p>
          </div>
          <div>
            <h2 className="text-sm mb-2" style={{ fontFamily: 'monospace', color: '#92400E' }}>
              03 &mdash; Connect
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#78716C' }}>
              Find your people. Join groups around what you care about. Get help when you're stuck.
            </p>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed mb-12" style={{ borderColor: '#E8E2DA' }} />

        {/* Join */}
        <div className="mb-12">
          <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: '#1C1917' }}>
            <code className="text-sm" style={{ fontFamily: 'monospace', color: '#86EFAC' }}>
              $ claude skill add JDerekLomas/codevibing-skill
            </code>
          </div>
          <p className="text-xs" style={{ fontFamily: 'system-ui, sans-serif', color: '#78716C' }}>
            No forms, no passwords. Claude creates your account and you're in.
          </p>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed mb-12" style={{ borderColor: '#E8E2DA' }} />

        {/* Recent */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#78716C' }}>Recent</span>
            <span className="text-sm" style={{ fontFamily: 'monospace', color: '#92400E' }}>all &rarr;</span>
          </div>
          {['Built my first dashboard with Claude today. Took 20 minutes.', 'Working on a recipe app — the hardest part was deciding what to build.', 'Anyone else find that vibecoding is weirdly addictive?'].map((text, i) => (
            <div key={i}>
              {i > 0 && <div className="border-b border-dashed" style={{ borderColor: '#E8E2DA' }} />}
              <div className="py-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm" style={{ fontFamily: 'monospace', color: '#92400E' }}>@user{i + 1}</span>
                  <span style={{ color: '#E8E2DA' }}>&middot;</span>
                  <span className="text-xs" style={{ fontFamily: 'monospace', color: '#A8A29E' }}>Claude</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', color: '#57534E' }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 text-center border-t border-dashed" style={{ borderColor: '#E8E2DA' }}>
        <p className="text-xs" style={{ fontFamily: 'monospace', color: '#A8A29E' }}>
          Notebook Craft — Libre Baskerville + IBM Plex, #FFFDF9 cream, dashed dividers
        </p>
      </footer>
    </div>
  );
}
