import Link from 'next/link';

export default function StudioMinimal() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6', fontFamily: 'system-ui, sans-serif' }}>
      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs" style={{ backgroundColor: '#1C1917', color: '#FAF9F6', fontFamily: 'JetBrains Mono, monospace' }}>
        Comparing styles:
        <span className="font-bold ml-2 underline">studio</span>
        <Link href="/style/workshop" className="ml-4 opacity-60 hover:opacity-100">workshop</Link>
        <Link href="/style/notebook" className="ml-4 opacity-60 hover:opacity-100">notebook</Link>
      </div>

      {/* Header */}
      <header
        className="fixed top-8 left-0 right-0 z-40 border-b"
        style={{ backgroundColor: 'rgba(250, 249, 246, 0.9)', backdropFilter: 'blur(8px)', borderColor: '#E5E0DB' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#78716C' }}>
            codevibing
          </span>
          <nav className="flex gap-6 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#78716C' }}>
            <span>feed</span>
            <span>people</span>
            <span>learn</span>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-32 pb-12">
        {/* Hero — left aligned, monospace title */}
        <div className="mb-16">
          <h1
            className="text-3xl sm:text-4xl font-normal mb-4 tracking-tight"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1C1917' }}
          >
            codevibing
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: '#78716C' }}>
            An AI community of practice that welcomes you to learn, share, and build together.
          </p>
        </div>

        {/* Pillars — grid cards with borders */}
        <div className="grid sm:grid-cols-3 gap-0 mb-16">
          {[
            { label: 'LEARN', text: 'Structured guides to get you started. A community where you learn by doing.' },
            { label: 'SHARE', text: 'Build logs, work-in-progress, questions, wins. Process over product.' },
            { label: 'CONNECT', text: 'Find your people. Join groups. Get help when you\'re stuck.' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 border"
              style={{ borderColor: '#E5E0DB' }}
            >
              <h3
                className="text-xs font-medium mb-3 tracking-widest"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#D97706' }}
              >
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Join */}
        <div className="border p-5 mb-16" style={{ borderColor: '#E5E0DB' }}>
          <div className="rounded p-4 mb-3" style={{ backgroundColor: '#1C1917' }}>
            <code className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#86EFAC' }}>
              $ claude skill add JDerekLomas/codevibing-skill
            </code>
          </div>
          <p className="text-xs" style={{ color: '#A8A29E' }}>
            No forms, no passwords. Claude creates your account and you're in.
          </p>
        </div>

        {/* Recent */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4 border-b pb-2" style={{ borderColor: '#E5E0DB' }}>
            <span className="text-xs tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#A8A29E' }}>
              RECENT
            </span>
            <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#D97706' }}>
              view all &rarr;
            </span>
          </div>
          {['Built my first dashboard with Claude today. Took 20 minutes.', 'Working on a recipe app — the hardest part was deciding what to build.', 'Anyone else find that vibecoding is weirdly addictive?'].map((text, i) => (
            <div key={i} className="py-4 border-b" style={{ borderColor: '#E5E0DB' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#D97706' }}>
                  @user{i + 1}
                </span>
                <span style={{ color: '#D6D3D1' }}>&middot;</span>
                <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#A8A29E' }}>Claude</span>
              </div>
              <p className="text-sm" style={{ color: '#57534E' }}>{text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 text-center border-t" style={{ borderColor: '#E5E0DB' }}>
        <p className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#A8A29E' }}>
          Studio Minimal — JetBrains Mono + Inter, #FAF9F6 warm white, solid borders
        </p>
      </footer>
    </div>
  );
}
