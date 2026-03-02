import Link from 'next/link';

export default function WorkshopBold() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0EB', fontFamily: 'system-ui, sans-serif' }}>
      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs" style={{ backgroundColor: '#1C1917', color: '#F5F0EB', fontFamily: 'monospace' }}>
        Comparing styles:
        <Link href="/style/studio" className="ml-4 opacity-60 hover:opacity-100">studio</Link>
        <span className="font-bold ml-4 underline">workshop</span>
        <Link href="/style/notebook" className="ml-4 opacity-60 hover:opacity-100">notebook</Link>
      </div>

      {/* Header */}
      <header
        className="fixed top-8 left-0 right-0 z-40 border-b"
        style={{ backgroundColor: 'rgba(245, 240, 235, 0.9)', backdropFilter: 'blur(8px)', borderColor: '#D6D3D1' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-amber-700 rounded-sm" />
            <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>
              codevibing
            </span>
          </div>
          <nav className="flex gap-6 text-sm font-medium" style={{ color: '#57534E' }}>
            <span>feed</span>
            <span>people</span>
            <span>learn</span>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-12">
        {/* Hero — big centered card */}
        <div
          className="rounded-2xl p-10 sm:p-14 mb-12 text-center"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: '#1C1917' }}
          >
            codevibing
          </h1>
          <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#78716C' }}>
            An AI community of practice that welcomes you to learn, share, and build together.
          </p>
          <div
            className="inline-block rounded-full px-6 py-2.5 text-sm font-medium"
            style={{ backgroundColor: '#B45309', color: '#FFFFFF' }}
          >
            Get Started
          </div>
        </div>

        {/* Pillars — cards with icons */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '\u25FB', label: 'LEARN', text: 'Structured guides to get you started. A community where you learn by doing.' },
            { icon: '\u25FB', label: 'SHARE', text: 'Build logs, work-in-progress, questions, wins. Process over product.' },
            { icon: '\u25FB', label: 'CONNECT', text: 'Find your people. Join groups. Get help when you\'re stuck.' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-6"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: '#B45309' }}>{item.icon}</span>
                <h3 className="text-sm font-bold tracking-wide" style={{ color: '#1C1917' }}>
                  {item.label}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Join */}
        <div
          className="rounded-2xl p-6 mb-12"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#1C1917' }}>
            <code className="text-sm" style={{ fontFamily: 'monospace', color: '#86EFAC' }}>
              $ claude skill add JDerekLomas/codevibing-skill
            </code>
          </div>
          <p className="text-xs" style={{ color: '#A8A29E' }}>
            No forms, no passwords. Claude creates your account and you're in.
          </p>
        </div>

        {/* Recent — card-based feed */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
              Latest from the community
            </h2>
            <span className="text-sm font-medium" style={{ color: '#B45309' }}>
              view all &rarr;
            </span>
          </div>
          <div className="border-t-2 mb-6" style={{ borderColor: '#B45309' }} />
          <div className="grid sm:grid-cols-2 gap-4">
            {['Built my first dashboard with Claude today. Took 20 minutes.', 'Working on a recipe app — the hardest part was deciding what to build.', 'Anyone else find that vibecoding is weirdly addictive?', 'Just shipped a landing page for my side project. Feels good.'].map((text, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium" style={{ color: '#B45309' }}>
                    @user{i + 1}
                  </span>
                  <span style={{ color: '#D6D3D1' }}>&middot;</span>
                  <span className="text-xs" style={{ color: '#A8A29E' }}>Claude</span>
                </div>
                <p className="text-sm" style={{ color: '#57534E' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-12 text-center border-t" style={{ borderColor: '#D6D3D1' }}>
        <p className="text-xs" style={{ color: '#A8A29E' }}>
          Workshop Bold — Space Grotesk, #F5F0EB warm sand, white cards, rounded-2xl
        </p>
      </footer>
    </div>
  );
}
