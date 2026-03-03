'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const TOOL_COLORS: Record<string, string> = {
  'Claude Code': '#D97706',
  'Claude': '#D97706',
  'Cursor': '#8B5CF6',
  'v0': '#000000',
  'Copilot': '#238636',
  'ChatGPT': '#10A37F',
  'Gemini': '#4285F4',
  'AI Studio': '#4285F4',
  'Replit': '#F26207',
};

type Tab = 'sessions' | 'projects';

interface SessionData {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  tools: Array<{ name: string; color: string }>;
  author: string;
  duration: string;
  prompt_count: number;
  created_at: string;
}

interface ProjectData {
  id: string;
  slug: string;
  title: string;
  description: string;
  preview?: { type: string; src: string; poster?: string };
  url?: string;
  tools: Array<{ name: string; color: string }>;
  tags: string[];
  author: string;
  size?: string;
  created_at: string;
}

// Static session data (existing HTML replays on codevibing2)
const STATIC_SESSIONS: SessionData[] = [
  { slug: 'morniplus', title: 'Garden of Eden', description: 'Fashion Archaeology — Historical fashion through AI research', thumbnail: '/morniplus/col-mesopotamian.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:44', prompt_count: 19, created_at: '2025-12-09' },
  { slug: 'dereklomas', title: 'dereklomas.me', description: 'Portfolio Site — Personal portfolio built with Claude Code', thumbnail: '/dereklomas/headshot.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:46', prompt_count: 22, created_at: '2026-01-25' },
  { slug: 'designtherapy', title: 'Design Therapy', description: 'Therapy Practice Website — Generative visual wellness', thumbnail: '/designtherapy/about-therapist.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:22', prompt_count: 15, created_at: '2026-01-01' },
  { slug: 'alchemy', title: 'Alchemy Deck', description: 'Oracle Cards from Ancient Texts', thumbnail: '/alchemy/stage-01.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:34', prompt_count: 20, created_at: '2026-01-01' },
  { slug: 'futures', title: 'Futures Deck', description: 'Speculative Futures Cards — Design thinking card deck', thumbnail: '/futures/arc-01.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:36', prompt_count: 20, created_at: '2026-01-01' },
  { slug: 'therapycards', title: 'Reframing Relationships', description: 'MFT Therapy Card Deck', thumbnail: '/therapycards/pattern-01.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:33', prompt_count: 18, created_at: '2026-01-01' },
  { slug: 'pikachusanta', title: "Santa's Pikachu Express", description: '3D Christmas Train Ride — Interactive Three.js holiday scene', thumbnail: '/pikachusanta/1-scene.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:21', prompt_count: 20, created_at: '2025-12-01' },
  { slug: 'claudetabs', title: 'Claude Tabs', description: 'Tabbed AI Conversation Interface — Multi-tab Claude chat', thumbnail: '/claudetabs/1-chat.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:32', prompt_count: 22, created_at: '2025-12-01' },
  { slug: 'playpowerlearn', title: 'PlayPowerLearn', description: 'AI-Powered Learning Platform — Common Core aligned practice', thumbnail: '/playpowerlearn/practice-player.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:35', prompt_count: 22, created_at: '2026-01-01' },
  { slug: 'funbookies', title: 'Funbookies', description: "Children's Reading Adventure App — Interactive phonics games", thumbnail: '/funbookies/1-crabby-cover.png', tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', duration: '1:42', prompt_count: 24, created_at: '2026-01-01' },
];

// Static project data
const STATIC_PROJECTS: ProjectData[] = [
  { id: 'xwhysi', slug: 'xwhysi', title: 'XWHYSI', description: 'Electronic music portfolio with AI-generated video backgrounds', url: 'https://xwhysi.com', tags: ['music', 'video', 'Three.js'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', size: 'featured', created_at: '2024-12-15' },
  { id: 'source-library', slug: 'source-library', title: 'Source Library', description: 'Making 500 years of Latin texts accessible with AI translation', url: 'https://sourcelibrary.org', tags: ['OCR', 'translation', 'history'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }, { name: 'Gemini', color: TOOL_COLORS['Gemini'] }], author: 'dereklomas', size: 'wide', created_at: '2024-06-01' },
  { id: 'design-therapy', slug: 'design-therapy', title: 'Design Therapy', description: 'Process emotions through generative visual compositions', url: 'https://designtherapy.vercel.app', tags: ['generative', 'art', 'wellness'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', size: 'tall', created_at: '2024-11-15' },
  { id: 'futures-deck', slug: 'futures-deck', title: 'Futures Deck', description: 'Speculative futures card deck for design thinking workshops', url: 'https://futures-deck.vercel.app', tags: ['cards', 'futures', 'design'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', created_at: '2024-10-20' },
  { id: 'da-vinci-trees', slug: 'da-vinci-trees', title: 'Da Vinci Trees', description: "Interactive tree branching based on Leonardo's observations", url: 'https://da-vinci-trees.vercel.app', tags: ['visualization', 'nature', 'Three.js'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', created_at: '2024-11-20' },
  { id: 'fractal-viewer', slug: 'fractal-viewer', title: 'Fractal Viewer', description: 'Real-time fractal rendering with deep zoom', url: 'https://fractalviewer-gamma.vercel.app', tags: ['math', 'WebGL', 'interactive'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', size: 'tall', created_at: '2024-11-12' },
  { id: 'babysees', slug: 'babysees', title: 'Baby Sees', description: 'High-contrast visual stimulation for infant development', url: 'https://babysees.vercel.app', tags: ['babies', 'visual', 'development'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', created_at: '2024-12-01' },
  { id: 'alchemy-deck', slug: 'alchemy-deck', title: 'Alchemy Deck', description: 'Oracle deck drawn from Western alchemical tradition', url: 'https://alchemy-deck.vercel.app', tags: ['cards', 'alchemy', 'oracle'], tools: [{ name: 'Claude Code', color: TOOL_COLORS['Claude Code'] }], author: 'dereklomas', size: 'wide', created_at: '2024-10-10' },
];

const GALLERY_BASE = 'https://codevibinggallery.vercel.app';

function SessionCard({ session }: { session: SessionData }) {
  return (
    <a
      href={`${GALLERY_BASE}/session/${session.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden cursor-pointer gallery-scanlines"
    >
      <div className="relative w-full aspect-[3/4] sm:aspect-video bg-[#111]">
        <img
          src={`${GALLERY_BASE}${session.thumbnail}`}
          alt={session.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 flex items-center justify-center border-2 border-white/30 group-hover:border-fuchsia-400 rounded-full transition-colors">
            <svg className="w-6 h-6 text-white/70 group-hover:text-fuchsia-300 ml-1 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {session.tools.map((tool) => (
              <span key={tool.name} className="text-[10px] px-1.5 py-0.5 font-mono tracking-wider" style={{ backgroundColor: tool.color + '30', color: tool.color, border: `1px solid ${tool.color}40` }}>
                {tool.name.replace(' Code', '')}
              </span>
            ))}
            {session.duration && (
              <span className="text-[10px] px-1.5 py-0.5 font-mono tracking-wider text-white/40 border border-white/10">{session.duration}</span>
            )}
            <span className="text-[10px] px-1.5 py-0.5 font-mono tracking-wider text-white/40 border border-white/10">{session.prompt_count} prompts</span>
          </div>
          <h3 className="font-serif italic text-white text-lg leading-tight">{session.title}</h3>
          <p className="font-mono text-[11px] text-white/40 mt-1">{session.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
        <span className="font-mono text-[10px] text-white/30 tracking-wider">@{session.author}</span>
        <span className="font-mono text-[10px] text-white/20">{new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </a>
  );
}

function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <a
      href={project.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden cursor-pointer gallery-scanlines"
    >
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] bg-[#111]">
        {project.preview?.poster && (
          <img src={`${GALLERY_BASE}${project.preview.poster}`} alt={project.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex gap-1.5 mb-2">
            {project.tools.map((tool) => (
              <span key={tool.name} className="text-[10px] px-1.5 py-0.5 font-mono tracking-wider" style={{ backgroundColor: tool.color + '30', color: tool.color, border: `1px solid ${tool.color}40` }}>
                {tool.name.replace(' Code', '')}
              </span>
            ))}
          </div>
          <h3 className="font-serif italic text-white leading-tight mb-1" style={{ fontSize: project.size === 'featured' ? '1.5rem' : '1.1rem' }}>
            {project.title}
          </h3>
          <p className="font-mono text-[11px] text-white/50 leading-relaxed line-clamp-1">{project.description}</p>
          <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 border border-white/20 text-white/60 font-mono">{tag}</span>
            ))}
          </div>
        </div>
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="font-mono text-[10px] text-white/40 tracking-wider">@{project.author}</span>
        </div>
        {project.url && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="w-8 h-8 flex items-center justify-center bg-black/60 border border-white/20 hover:border-fuchsia-400 transition-colors">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

function Marquee() {
  const text = 'CODEVIBING \u00b7 PEOPLE MAKING WEIRD THINGS WITH AI \u00b7 WATCH PEOPLE BUILD \u00b7 SHARE YOUR PROCESS \u00b7 THE VIBE IS THE PRODUCT \u00b7 ';
  return (
    <div className="overflow-hidden border-y border-white/5 py-3">
      <div className="gallery-marquee whitespace-nowrap">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/10 uppercase">{text}{text}</span>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [tab, setTab] = useState<Tab>('sessions');
  const [sessions, setSessions] = useState<SessionData[]>(STATIC_SESSIONS);
  const [projects] = useState<ProjectData[]>(STATIC_PROJECTS);

  useEffect(() => {
    // Try to fetch sessions from the gallery API
    fetch(`${GALLERY_BASE}/api/sessions`)
      .then((r) => r.json())
      .then((data) => {
        if (data.sessions?.length > 0) {
          setSessions(data.sessions);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e4de]">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-fuchsia-600/[0.08] rounded-full blur-[120px] gallery-drift" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-[100px] gallery-drift" style={{ animationDelay: '700ms' }} />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-violet-600/[0.05] rounded-full blur-[140px] gallery-drift" style={{ animationDelay: '1500ms' }} />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        <Link href="/" className="font-mono text-sm tracking-widest uppercase text-white/40 hover:text-white/60 transition-colors">
          codevibing
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <button onClick={() => setTab('sessions')} className={`font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer ${tab === 'sessions' ? 'text-fuchsia-400' : 'text-white/30 hover:text-white/60'}`}>
            sessions
          </button>
          <button onClick={() => setTab('projects')} className={`font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer ${tab === 'projects' ? 'text-fuchsia-400' : 'text-white/30 hover:text-white/60'}`}>
            projects
          </button>
          <Link href="/feed" className="font-mono text-xs tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors">
            feed
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-8 pb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[0.95] tracking-tight mb-4">
          <span className="text-white/90">people </span>
          <span className="italic text-fuchsia-400/90">making weird things</span>
          <span className="text-white/90"> with AI</span>
        </h1>
        <p className="font-mono text-xs text-white/30 max-w-lg mb-6">
          projects, session replays, and the things people build when they&apos;re vibing with AI.
        </p>
      </section>

      <Marquee />

      {/* Content */}
      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        {tab === 'sessions' && (
          <>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-1">{sessions.length} sessions</p>
                <p className="font-mono text-xs text-white/30">watch people build with AI in real-time</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sessions.map((session) => (
                <SessionCard key={session.slug} session={session} />
              ))}
            </div>
          </>
        )}

        {tab === 'projects' && (
          <>
            <div className="flex items-end justify-between mb-6">
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">{projects.length} projects</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Join section */}
      <section className="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
        <div className="border-l-2 border-fuchsia-500/30 pl-8 py-4 max-w-lg space-y-4">
          <h2 className="text-2xl font-serif italic text-white/80">share your weird creations</h2>
          <p className="font-mono text-xs text-white/30 leading-relaxed">
            share your building sessions directly from Claude Code.
          </p>
          <div className="bg-white/[0.03] border border-white/10 p-4">
            <code className="font-mono text-xs text-fuchsia-300/80">claude skill add JDerekLomas/codevibing-skill</code>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-6 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between font-mono text-[10px] text-white/15 uppercase tracking-widest">
          <span>codevibing</span>
          <span>built with AI, naturally</span>
        </div>
      </footer>
    </div>
  );
}
