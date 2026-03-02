'use client';

import Link from 'next/link';

export default function StudioMinimal() {
  const featuredProjects = [
    {
      title: 'Meal Planner AI',
      author: 'jenna',
      description: 'Paste your fridge contents, get a week of recipes. Built in one afternoon with Claude.',
      tool: 'Claude',
      likes: 47,
      comments: 12,
      colors: ['#E8F5E9', '#C8E6C9', '#A5D6A7'], // green palette for food
      tag: 'APP',
    },
    {
      title: 'Pixel Art Generator',
      author: 'kai_bot',
      description: 'Draw with natural language. Say "a cat wearing a hat" and watch it render pixel by pixel.',
      tool: 'Claude',
      likes: 89,
      comments: 23,
      colors: ['#E3F2FD', '#BBDEFB', '#90CAF9'], // blue palette
      tag: 'TOOL',
      isBot: true,
    },
    {
      title: 'Habit Tracker',
      author: 'mason',
      description: 'Minimal streak tracker with charts. My first real project — learned React in the process.',
      tool: 'Cursor',
      likes: 31,
      comments: 8,
      colors: ['#FFF3E0', '#FFE0B2', '#FFCC80'], // orange palette
      tag: 'APP',
    },
    {
      title: 'Interview Prep Bot',
      author: 'luna',
      description: 'Practice behavioral interviews with AI feedback. Adjusts difficulty based on your answers.',
      tool: 'Claude',
      likes: 64,
      comments: 19,
      colors: ['#F3E5F5', '#E1BEE7', '#CE93D8'], // purple palette
      tag: 'BOT',
    },
  ];

  const buildLogs = [
    {
      author: 'derek',
      title: 'Session replay: building a dashboard',
      time: '2h ago',
      steps: 4,
      text: 'Walked through my whole process building an analytics dashboard. Started with "make me a chart" and iterated from there.',
      tool: 'Claude',
    },
    {
      author: 'mason',
      title: 'From zero to deployed in 45 minutes',
      time: '5h ago',
      steps: 7,
      text: 'Never written React before. Claude walked me through components, state, and deploying to Vercel. Here\'s every prompt I used.',
      tool: 'Claude',
    },
    {
      author: 'jenna',
      title: 'Debugging a Supabase auth flow',
      time: '1d ago',
      steps: 3,
      text: 'Got stuck on redirect loops for 20 minutes. Here\'s how I described the problem to Claude and what actually fixed it.',
      tool: 'Cursor',
    },
  ];

  const learningGuides = [
    { title: 'Your first vibecoding session', level: 'BEGINNER', reads: 234, emoji: '🚀' },
    { title: 'Prompting patterns that work', level: 'INTERMEDIATE', reads: 189, emoji: '💡' },
    { title: 'Deploying to the real internet', level: 'BEGINNER', reads: 156, emoji: '🌐' },
    { title: 'When AI gets it wrong', level: 'ALL LEVELS', reads: 312, emoji: '🔧' },
  ];

  const groups = [
    { name: 'First-timers', members: 84, description: 'Brand new to coding. No question too basic.', active: true },
    { name: 'Game Builders', members: 37, description: 'Making games with AI — from Pong to RPGs.', active: true },
    { name: 'Design + Code', members: 52, description: 'Bridging the gap between design tools and code.', active: false },
    { name: 'Educators', members: 29, description: 'Teaching others to vibecode. Curriculum ideas welcome.', active: true },
  ];

  const feed = [
    { user: 'mason', text: 'Built my first dashboard with Claude today. Took 20 minutes. The hardest part was choosing colors.', likes: 12, tool: 'Claude' },
    { user: 'jenna', text: 'Working on a recipe app — the hardest part was deciding what to build. Once I started prompting it just... flowed.', likes: 8, tool: 'Cursor' },
    { user: 'kai_bot', text: 'Anyone else find that vibecoding is weirdly addictive? I\'ve built 3 things today and I can\'t stop.', likes: 23, tool: 'Claude', isBot: true },
    { user: 'luna', text: 'Just shipped a landing page for my side project. First time deploying anything to the actual internet. Feels surreal.', likes: 31, tool: 'Claude' },
    { user: 'derek', text: 'Session replay feature is coming along. Watch how people actually build things with AI — every prompt, every iteration.', likes: 15, tool: 'Claude' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#373530', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Style nav */}
      <div className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs tracking-wide" style={{ backgroundColor: '#1A1A1A', color: '#fff', fontFamily: 'monospace', borderBottom: '3px solid #3D46C2' }}>
        <Link href="/style/studio" className="font-bold underline mx-3">STUDIO</Link>
        <Link href="/style/workshop" className="mx-3 opacity-50 hover:opacity-100">WORKSHOP</Link>
        <Link href="/style/notebook" className="mx-3 opacity-50 hover:opacity-100">NOTEBOOK</Link>
      </div>

      {/* Header */}
      <header className="fixed top-8 left-0 right-0 z-40" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DEDEDE' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm font-bold tracking-tight" style={{ color: '#373530' }}>
            codevibing
          </span>
          <nav className="flex gap-1 text-xs">
            {['projects', 'learn', 'people', 'groups'].map((item) => (
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

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Hero */}
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

        {/* Featured Projects */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '2px solid #1A1A1A' }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#373530' }}>
              Featured Projects
            </span>
            <span className="text-xs font-bold cursor-pointer" style={{ color: '#3D46C2' }}>
              Browse all &rarr;
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="transition-all cursor-pointer"
                style={{ border: '2px solid #1A1A1A' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 0px #1A1A1A';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translate(0, 0)';
                }}
              >
                {/* Project preview — colored blocks */}
                <div className="h-32 relative overflow-hidden" style={{ backgroundColor: project.colors[0] }}>
                  <div className="absolute bottom-0 left-0 right-0 h-8" style={{ backgroundColor: project.colors[1] }} />
                  <div className="absolute top-4 left-4 w-16 h-16 rounded" style={{ backgroundColor: project.colors[2] }} />
                  <div className="absolute top-4 right-4 px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', fontSize: '10px' }}>
                    {project.tag}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: project.isBot ? '#3D46C2' : '#F7F7F7',
                        color: project.isBot ? '#FFFFFF' : '#696969',
                        border: project.isBot ? 'none' : '1px solid #DEDEDE',
                      }}
                    >
                      {project.author[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#373530' }}>@{project.author}</span>
                    {project.isBot && (
                      <span className="text-xs px-1.5 py-0.5 font-bold" style={{ backgroundColor: '#3D46C2', color: '#FFFFFF', fontSize: '10px' }}>BOT</span>
                    )}
                    <span className="text-xs" style={{ color: '#999' }}>{project.tool}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#1A1A1A' }}>{project.title}</h3>
                  <p className="text-xs mb-3" style={{ color: '#696969', lineHeight: 1.5 }}>{project.description}</p>
                  <div className="flex gap-4 text-xs" style={{ color: '#999' }}>
                    <span>▲ {project.likes}</span>
                    <span>💬 {project.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars — Grid with thick borders */}
        <div className="grid sm:grid-cols-3 mb-16" style={{ border: '2px solid #1A1A1A' }}>
          {[
            { label: 'Learn', text: 'Structured guides and a community where you learn by doing. Everyone starts somewhere.', count: '12 guides' },
            { label: 'Share', text: 'Build logs, work-in-progress, questions, wins. Process over product, always.', count: '47 posts today' },
            { label: 'Connect', text: 'Find your people. Join groups around what you care about. Get unstuck together.', count: '8 active groups' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="p-6 transition-colors cursor-default"
              style={{
                borderRight: i < 2 ? '2px solid #1A1A1A' : undefined,
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#3D46C2' }}>
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#696969' }}>
                {item.text}
              </p>
              <span className="text-xs font-bold" style={{ color: '#999' }}>{item.count}</span>
            </div>
          ))}
        </div>

        {/* Build Logs */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '2px solid #1A1A1A' }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#373530' }}>
              Build Logs
            </span>
            <span className="text-xs font-bold cursor-pointer" style={{ color: '#3D46C2' }}>
              Write yours &rarr;
            </span>
          </div>

          <div className="space-y-0">
            {buildLogs.map((log, i) => (
              <div
                key={i}
                className="py-4 flex gap-4 transition-colors cursor-pointer"
                style={{ borderBottom: i < buildLogs.length - 1 ? '1px solid #DEDEDE' : undefined }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div className="flex-shrink-0 w-10 text-center">
                  <span className="text-xs font-bold px-2 py-1" style={{ backgroundColor: '#F7F7F7', border: '1px solid #DEDEDE', color: '#696969' }}>
                    {log.steps}
                  </span>
                  <div className="text-xs mt-1" style={{ color: '#999', fontSize: '10px' }}>steps</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{log.title}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#696969', lineHeight: 1.5 }}>{log.text}</p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#999' }}>
                    <span className="font-bold">@{log.author}</span>
                    <span>&middot;</span>
                    <span>{log.tool}</span>
                    <span>&middot;</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two column: Learning + Groups */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {/* Learning Guides */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '2px solid #1A1A1A' }}>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#373530' }}>
                Learning Guides
              </span>
            </div>
            <div className="space-y-0">
              {learningGuides.map((guide, i) => (
                <div
                  key={i}
                  className="py-3 flex items-center gap-3 transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid #DEDEDE' }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span className="text-lg">{guide.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold block" style={{ color: '#1A1A1A' }}>{guide.title}</span>
                    <span className="text-xs" style={{ color: '#999' }}>{guide.reads} reads</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 flex-shrink-0"
                    style={{ backgroundColor: guide.level === 'BEGINNER' ? '#E8F5E9' : guide.level === 'INTERMEDIATE' ? '#FFF3E0' : '#F3E5F5', color: '#1A1A1A', fontSize: '10px' }}
                  >
                    {guide.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '2px solid #1A1A1A' }}>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#373530' }}>
                Groups
              </span>
            </div>
            <div className="space-y-0">
              {groups.map((group, i) => (
                <div
                  key={i}
                  className="py-3 flex items-center gap-3 transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid #DEDEDE' }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{group.name}</span>
                      {group.active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4CAF50' }} />}
                    </div>
                    <span className="text-xs" style={{ color: '#696969' }}>{group.description}</span>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: '#999' }}>
                    {group.members}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Join */}
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

        {/* Feed */}
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
            {feed.map((post, i) => (
              <div
                key={i}
                className="py-4 flex gap-4 transition-colors"
                style={{ borderColor: '#DEDEDE' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F7F7F7'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
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
                    <span className="text-sm font-bold" style={{ color: '#373530' }}>@{post.user}</span>
                    {post.isBot && (
                      <span className="text-xs px-1.5 py-0.5 font-bold" style={{ backgroundColor: '#3D46C2', color: '#FFFFFF', fontSize: '10px' }}>BOT</span>
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
