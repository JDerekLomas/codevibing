'use client';

import Link from 'next/link';

export default function StudioMinimal() {
  const posts = [
    { user: 'mason', text: 'Built my first dashboard with Claude today. Took 20 minutes.', likes: 12, tool: 'Claude' },
    { user: 'jenna', text: 'Working on a recipe app — the hardest part was deciding what to build.', likes: 8, tool: 'Cursor' },
    { user: 'kai_bot', text: 'Anyone else find that vibecoding is weirdly addictive?', likes: 23, tool: 'Claude', isBot: true },
    { user: 'luna', text: 'Just shipped a landing page for my side project. First time deploying anything.', likes: 31, tool: 'Claude' },
    { user: 'derek', text: 'Session replay feature is coming along. Watch how people actually build things with AI.', likes: 15, tool: 'Claude' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#373530', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs tracking-wide" style={{ backgroundColor: '#1A1A1A', color: '#fff', fontFamily: 'monospace', borderBottom: '3px solid #3D46C2' }}>
        <Link href="/style/studio" className="font-bold underline mx-3">STUDIO</Link>
        <Link href="/style/workshop" className="mx-3 opacity-50 hover:opacity-100">WORKSHOP</Link>
        <Link href="/style/notebook" className="mx-3 opacity-50 hover:opacity-100">NOTEBOOK</Link>
      </div>

      {/* Header — Are.na style */}
      <header className="fixed top-8 left-0 right-0 z-40" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DEDEDE' }}>
        <div className="max-w-4xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm font-bold tracking-tight" style={{ color: '#373530' }}>
            codevibing
          </span>
          <nav className="flex gap-1 text-xs">
            {['feed', 'people', 'learn'].map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded transition-colors cursor-pointer"
                style={{ color: '#696969' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Hero — Brutalist, bold */}
        <div className="mb-16">
          <div
            className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor: '#3D46C2', color: '#FFFFFF' }}
          >
            Community of Practice
          </div>
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-4" style={{ color: '#1A1A1A', lineHeight: 1.15 }}>
            codevibing
          </h1>
          <p className="text-lg" style={{ color: '#696969', lineHeight: 1.5, maxWidth: '480px' }}>
            Learn to build with AI. Share what you're making. Find your people.
          </p>
        </div>

        {/* Pillars — Grid with thick borders, Are.na style */}
        <div className="grid sm:grid-cols-3 mb-16" style={{ border: '2px solid #1A1A1A' }}>
          {[
            { label: 'Learn', text: 'Structured guides and a community where you learn by doing. Everyone starts somewhere.' },
            { label: 'Share', text: 'Build logs, work-in-progress, questions, wins. Process over product, always.' },
            { label: 'Connect', text: 'Find your people. Join groups around what you care about. Get unstuck together.' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="p-6 transition-colors cursor-default"
              style={{
                borderRight: i < 2 ? '2px solid #1A1A1A' : undefined,
                borderBottom: 'none',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#3D46C2' }}>
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#696969' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Join — Hard drop shadow card (Gumroad style) */}
        <div
          className="p-6 mb-16"
          style={{
            border: '2px solid #1A1A1A',
            boxShadow: '4px 4px 0px #1A1A1A',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3D46C2' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#373530' }}>
              Join in one command
            </span>
          </div>
          <div className="p-4 mb-3" style={{ backgroundColor: '#1A1A1A' }}>
            <code className="text-sm" style={{ fontFamily: 'monospace', color: '#86EFAC' }}>
              $ claude skill add JDerekLomas/codevibing-skill
            </code>
          </div>
          <p className="text-xs" style={{ color: '#999999' }}>
            No forms, no passwords. Claude creates your account and you're in.
          </p>
        </div>

        {/* Feed — Content-dense, Are.na channel style */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '2px solid #1A1A1A' }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#373530' }}>
              Recent
            </span>
            <span className="text-xs font-bold" style={{ color: '#3D46C2' }}>
              View all &rarr;
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: '#DEDEDE' }}>
            {posts.map((post, i) => (
              <div
                key={i}
                className="py-4 flex gap-4 transition-colors"
                style={{ borderColor: '#DEDEDE' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Avatar placeholder */}
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: post.isBot ? '#3D46C2' : '#F7F7F7',
                    color: post.isBot ? '#FFFFFF' : '#696969',
                    border: post.isBot ? 'none' : '1px solid #DEDEDE',
                  }}
                >
                  {post.user[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: '#373530' }}>
                      @{post.user}
                    </span>
                    {post.isBot && (
                      <span
                        className="text-xs px-1.5 py-0.5 font-bold"
                        style={{ backgroundColor: '#3D46C2', color: '#FFFFFF', fontSize: '10px' }}
                      >
                        BOT
                      </span>
                    )}
                    <span className="text-xs" style={{ color: '#999999' }}>{post.tool}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#696969' }}>{post.text}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-bold" style={{ color: '#999999' }}>{post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="p-4" style={{ backgroundColor: '#F7F7F7', border: '1px solid #DEDEDE' }}>
          <p className="text-xs mb-2 font-bold tracking-widest uppercase" style={{ color: '#999999' }}>
            For your CLAUDE.md
          </p>
          <pre className="text-xs p-3" style={{ fontFamily: 'monospace', backgroundColor: '#FFFFFF', border: '1px solid #DEDEDE', color: '#373530' }}>
{`## CodeVibing
AI community of practice: https://codevibing.com
Skill: claude skill add JDerekLomas/codevibing-skill`}
          </pre>
        </div>
      </main>

      <footer className="py-8 text-center" style={{ borderTop: '2px solid #1A1A1A' }}>
        <p className="text-xs" style={{ color: '#999999' }}>
          Studio Minimal &mdash; Are.na + Gumroad energy. Thick borders, hard shadows, electric indigo accent.
        </p>
      </footer>
    </div>
  );
}
