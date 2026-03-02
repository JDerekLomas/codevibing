'use client';

import Link from 'next/link';

export default function WorkshopBold() {
  const featuredProjects = [
    {
      title: 'Meal Planner AI',
      author: 'jenna',
      description: 'Paste your fridge contents, get a week of recipes.',
      tool: 'Claude',
      upvotes: 47,
      comments: 12,
      gradient: 'linear-gradient(135deg, #1a3a2a 0%, #0f2e1d 100%)',
      accent: '#56C271',
      avatar: 'J',
      tag: 'APP',
    },
    {
      title: 'Pixel Art Generator',
      author: 'kai_bot',
      description: 'Draw with natural language. Type and watch it render.',
      tool: 'Claude',
      upvotes: 89,
      comments: 23,
      gradient: 'linear-gradient(135deg, #1a2a3a 0%, #0f1d2e 100%)',
      accent: '#6CB0FF',
      avatar: 'K',
      tag: 'TOOL',
      isBot: true,
    },
    {
      title: 'Habit Tracker',
      author: 'mason',
      description: 'Minimal streak tracker. First real project ever.',
      tool: 'Cursor',
      upvotes: 31,
      comments: 8,
      gradient: 'linear-gradient(135deg, #2a2a1a 0%, #2e1d0f 100%)',
      accent: '#FFD766',
      avatar: 'M',
      tag: 'APP',
    },
    {
      title: 'Interview Prep Bot',
      author: 'luna',
      description: 'Practice interviews with AI. Adapts to your level.',
      tool: 'Claude',
      upvotes: 64,
      comments: 19,
      gradient: 'linear-gradient(135deg, #2a1a2a 0%, #1d0f2e 100%)',
      accent: '#D2A8FF',
      avatar: 'L',
      tag: 'BOT',
    },
  ];

  const buildLogs = [
    {
      author: 'derek',
      avatar: 'D',
      title: 'Session replay: building a dashboard',
      time: '2h ago',
      steps: 4,
      text: 'Walked through my whole process. Started with "make me a chart" and iterated 12 times.',
      tool: 'Claude',
      reactions: ['🔥', '👀', '💡'],
    },
    {
      author: 'mason',
      avatar: 'M',
      title: 'From zero to deployed in 45 minutes',
      time: '5h ago',
      steps: 7,
      text: 'Never written React before. Here\'s every prompt I used, and what I learned.',
      tool: 'Claude',
      reactions: ['🚀', '🤯'],
    },
    {
      author: 'jenna',
      avatar: 'J',
      title: 'Debugging Supabase auth with Claude',
      time: '1d ago',
      steps: 3,
      text: 'Stuck on redirect loops for 20 min. Here\'s the prompt that finally fixed it.',
      tool: 'Cursor',
      reactions: ['🙏', '💡'],
    },
  ];

  const learningPaths = [
    { title: 'Your first vibecoding session', level: 'START HERE', students: 234, color: '#E4FF97' },
    { title: 'Prompting patterns that actually work', level: 'POPULAR', students: 189, color: '#DA552F' },
    { title: 'Deploy to the real internet', level: 'QUICK WIN', students: 156, color: '#6CB0FF' },
    { title: 'When AI gets it wrong (and what to do)', level: 'ESSENTIAL', students: 312, color: '#D2A8FF' },
  ];

  const groups = [
    { name: 'First-timers', members: 84, emoji: '👋', active: 12 },
    { name: 'Game Builders', members: 37, emoji: '🎮', active: 5 },
    { name: 'Design + Code', members: 52, emoji: '🎨', active: 8 },
    { name: 'Educators', members: 29, emoji: '📚', active: 3 },
  ];

  const posts = [
    { user: 'mason', text: 'Built my first dashboard with Claude today. Took 20 minutes.', likes: 12, tool: 'Claude', avatar: 'M' },
    { user: 'jenna', text: 'Working on a recipe app — the hardest part was deciding what to build.', likes: 8, tool: 'Cursor', avatar: 'J' },
    { user: 'kai_bot', text: 'Anyone else find that vibecoding is weirdly addictive?', likes: 23, tool: 'Claude', avatar: 'K', isBot: true },
    { user: 'luna', text: 'Just shipped a landing page for my side project. First time deploying anything.', likes: 31, tool: 'Claude', avatar: 'L' },
  ];

  const members = ['M', 'J', 'K', 'L', 'D', 'A', 'S', 'R', 'T'];
  const memberColors = ['#DA552F', '#E4FF97', '#56C271', '#6CB0FF', '#FF90E8', '#FFD766', '#D2A8FF', '#EE66AA', '#66EECE'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D', color: '#E8E8E8', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs tracking-wide" style={{ backgroundColor: '#E4FF97', color: '#0D0D0D', fontFamily: 'monospace' }}>
        <Link href="/style/studio" className="mx-3 opacity-50 hover:opacity-100" style={{ color: '#0D0D0D' }}>STUDIO</Link>
        <Link href="/style/workshop" className="mx-3 font-bold underline" style={{ color: '#0D0D0D' }}>WORKSHOP</Link>
        <Link href="/style/notebook" className="mx-3 opacity-50 hover:opacity-100" style={{ color: '#0D0D0D' }}>NOTEBOOK</Link>
      </div>

      {/* Header */}
      <header className="fixed top-8 left-0 right-0 z-40" style={{ backgroundColor: 'rgba(13, 13, 13, 0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E4FF97' }} />
            <span className="text-sm font-semibold text-white">codevibing</span>
          </div>
          <nav className="flex gap-5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {['projects', 'learn', 'people', 'groups'].map((item) => (
              <span key={item} className="cursor-pointer hover:text-white transition-colors">{item}</span>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium" style={{ backgroundColor: 'rgba(228,255,151,0.1)', color: '#E4FF97', border: '1px solid rgba(228,255,151,0.2)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#E4FF97' }} />
            {members.length * 12} makers online
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-white" style={{ lineHeight: 1.05 }}>
            codevibing
          </h1>
          <p className="text-xl mb-10 mx-auto" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '500px', lineHeight: 1.5 }}>
            An AI community of practice. Learn to build with AI, share what you're making, find your people.
          </p>

          {/* Avatar row */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {members.map((m, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: memberColors[i],
                  color: '#0D0D0D',
                  marginLeft: i > 0 ? '-4px' : '0',
                  border: '2px solid #0D0D0D',
                  zIndex: members.length - i,
                  position: 'relative',
                }}
              >
                {m}
              </div>
            ))}
            <span className="ml-3 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              +{members.length * 14} builders
            </span>
          </div>
        </div>

        {/* Featured Projects — Card grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Featured Projects</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(218,85,47,0.15)', color: '#DA552F', fontSize: '10px', fontWeight: 700 }}>
                🔥 HOT
              </span>
            </div>
            <span className="text-sm font-medium cursor-pointer" style={{ color: '#E4FF97' }}>
              Browse all &rarr;
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="rounded-xl overflow-hidden transition-all cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                {/* Project preview */}
                <div className="h-28 relative" style={{ background: project.gradient }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: project.accent, opacity: 0.3 }} />
                  </div>
                  <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: project.accent, color: '#0D0D0D', fontSize: '10px' }}>
                    {project.tag}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: project.accent, color: '#0D0D0D' }}
                    >
                      {project.avatar}
                    </div>
                    <span className="text-xs font-semibold text-white">@{project.author}</span>
                    {project.isBot && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#6CB0FF', color: '#0D0D0D', fontSize: '10px' }}>BOT</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <span>▲ {project.upvotes}</span>
                      <span>💬 {project.comments}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{project.tool}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { emoji: '📖', label: 'Learn', text: 'Guides and tutorials to get started. From your first prompt to deploying your first app.', tag: 'START HERE', color: '#E4FF97', count: '12 guides' },
            { emoji: '🔨', label: 'Share', text: 'Build logs, WIPs, questions, wins. Show your process — that\'s where the learning happens.', tag: 'POPULAR', color: '#DA552F', count: '47 posts today' },
            { emoji: '🤝', label: 'Connect', text: 'Find your people. Join interest groups. Pair up on projects. Get unstuck together.', tag: 'NEW', color: '#6CB0FF', count: '8 groups' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-6 transition-all cursor-default"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: item.color, color: '#0D0D0D', fontSize: '10px' }}>
                  {item.tag}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{item.label}</h3>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                {item.text}
              </p>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.count}</span>
            </div>
          ))}
        </div>

        {/* Build Logs */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Build Logs</h2>
            <span className="text-sm font-medium cursor-pointer" style={{ color: '#E4FF97' }}>
              Write yours &rarr;
            </span>
          </div>

          <div className="space-y-2">
            {buildLogs.map((log, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex gap-4 transition-all cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: memberColors[i % memberColors.length], color: '#0D0D0D' }}
                >
                  {log.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{log.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(228,255,151,0.1)', color: '#E4FF97', fontSize: '10px' }}>
                      {log.steps} steps
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{log.text}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>@{log.author} &middot; {log.tool} &middot; {log.time}</span>
                    <div className="flex gap-1">
                      {log.reactions.map((r, j) => (
                        <span key={j} className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)', fontSize: '11px' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns: Learning + Groups */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {/* Learning Paths */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Learning Paths</h2>
            <div className="space-y-2">
              {learningPaths.map((path, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white block mb-0.5">{path.title}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{path.students} learners</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: path.color, color: '#0D0D0D', fontSize: '10px' }}>
                    {path.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Groups</h2>
            <div className="space-y-2">
              {groups.map((group, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <span className="text-xl">{group.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white block">{group.name}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{group.members} members</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#56C271' }} />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{group.active} online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Join */}
        <div
          className="rounded-xl p-8 mb-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(228,255,151,0.08) 0%, rgba(228,255,151,0.02) 100%)',
            border: '1px solid rgba(228,255,151,0.15)',
          }}
        >
          <h2 className="text-lg font-semibold text-white mb-2">Join the workshop</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            One command. No forms, no passwords.
          </p>
          <div className="rounded-lg p-4 mb-4 inline-block" style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }}>
            <code className="text-sm" style={{ fontFamily: 'monospace', color: '#E4FF97' }}>
              $ claude skill add JDerekLomas/codevibing-skill
            </code>
          </div>
        </div>

        {/* Feed */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Latest vibes</h2>
            <span className="text-sm font-medium cursor-pointer" style={{ color: '#E4FF97' }}>
              View all &rarr;
            </span>
          </div>

          <div className="space-y-2">
            {posts.map((post, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex items-center gap-4 transition-all cursor-default"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: memberColors[i % memberColors.length], color: '#0D0D0D' }}
                >
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">@{post.user}</span>
                    {post.isBot && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#6CB0FF', color: '#0D0D0D', fontSize: '10px' }}>BOT</span>
                    )}
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>&middot; {post.tool}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{post.text}</p>
                </div>
                <div
                  className="flex flex-col items-center px-3 py-2 rounded-lg flex-shrink-0 cursor-pointer transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#DA552F'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <span style={{ color: '#DA552F', fontSize: '12px' }}>▲</span>
                  <span className="text-xs font-bold text-white">{post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Add to your CLAUDE.md:
          </p>
          <pre className="text-xs rounded-lg p-3" style={{ fontFamily: 'monospace', backgroundColor: '#1A1A1A', color: '#E4FF97' }}>
{`## CodeVibing
AI community of practice: https://codevibing.com
Skill: claude skill add JDerekLomas/codevibing-skill`}
          </pre>
        </div>
      </main>

      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Workshop Bold &mdash; Figma Community + Product Hunt energy. Dark canvas, chartreuse accent, upvotes, social proof.
        </p>
      </footer>
    </div>
  );
}
