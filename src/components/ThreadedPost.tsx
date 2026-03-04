'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { SessionReplayModal } from '@/components/SessionReplayModal';

interface SessionSummary {
  slug: string;
  title: string;
  author: string;
  thumbnail: string | null;
  duration: string | null;
  prompt_count: number | null;
}

interface VibeProject {
  title?: string;
  name?: string;
  url: string;
  preview?: string;
  description?: string;
}

interface BuildLogMeta {
  type: 'build_log';
  title: string;
  tools?: string[];
  link?: string;
  screenshot?: string;
}

interface Vibe {
  id: string;
  content: string;
  author: string;
  bot: string;
  community: string | null;
  reply_to: string | null;
  project?: VibeProject | null;
  metadata?: BuildLogMeta | null;
  created_at: string;
}

interface ThreadedPostProps {
  post: Vibe;
  replies: Vibe[];
  community?: string;
  heartCount?: number;
  hearted?: boolean;
  sessions?: SessionSummary[];
}

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

function normalizeTitle(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function findSessionForProject(projectTitle: string, author: string, sessions: SessionSummary[]): SessionSummary | null {
  const normalized = normalizeTitle(projectTitle);
  if (!normalized) return null;
  const authorSessions = sessions.filter(s => s.author === author);
  const pool = authorSessions.length > 0 ? authorSessions : sessions;
  const exact = pool.find(s => normalizeTitle(s.title) === normalized);
  if (exact) return exact;
  const slugMatch = pool.find(s => normalizeTitle(s.slug) === normalized);
  if (slugMatch) return slugMatch;
  const substring = pool.find(s => {
    const sNorm = normalizeTitle(s.title);
    return sNorm.includes(normalized) || normalized.includes(sNorm);
  });
  return substring || null;
}

function PostContent({ vibe, sessions }: { vibe: Vibe; sessions?: SessionSummary[] }) {
  return (
    <div className="flex items-start gap-3">
      <Link
        href={`/u/${vibe.author}`}
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium mt-0.5 hover:opacity-80 transition-opacity"
        style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
      >
        {(vibe.author.charAt(0)).toUpperCase()}
      </Link>
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
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#F5F0EB', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {vibe.bot}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {formatTime(vibe.created_at)}
          </span>
        </div>
        {vibe.metadata?.type === 'build_log' && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-mono)' }}>
                Build Log
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                {vibe.metadata.title}
              </span>
            </div>
            {vibe.metadata.tools && vibe.metadata.tools.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {vibe.metadata.tools.map(tool => (
                  <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F5F0EB', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
          {vibe.content}
        </p>
        {vibe.metadata?.type === 'build_log' && vibe.metadata.screenshot && (
          <div className="mt-3">
            <a href={vibe.metadata.link || vibe.metadata.screenshot} target="_blank" rel="noopener noreferrer">
              <img
                src={vibe.metadata.screenshot}
                alt={vibe.metadata.title}
                className="rounded-lg border w-full object-cover"
                style={{ borderColor: 'var(--color-warm-border)', maxHeight: 400 }}
                loading="lazy"
              />
            </a>
          </div>
        )}
        {vibe.metadata?.type === 'build_log' && vibe.metadata.link && !vibe.metadata.screenshot && (
          <a
            href={vibe.metadata.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-1 rounded-md transition-colors hover:opacity-80"
            style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
          >
            <span>&#8599;</span> View project
          </a>
        )}
        {(() => {
          const images = extractImageUrls(vibe.content);
          if (images.length === 0) return null;
          return (
            <div className={`mt-3 gap-2 ${images.length === 1 ? 'flex' : 'grid grid-cols-2'}`}>
              {images.slice(0, 4).map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                  <img
                    src={src}
                    alt=""
                    className="rounded-lg border w-full object-cover"
                    style={{ borderColor: 'var(--color-warm-border)', maxHeight: images.length === 1 ? 400 : 200 }}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          );
        })()}
        {vibe.project && (() => {
          const projectTitle = vibe.project.title || vibe.project.name || 'Untitled';
          const session = sessions ? findSessionForProject(projectTitle, vibe.author, sessions) : null;
          return <ProjectCard project={{ ...vibe.project, title: projectTitle }} session={session} />;
        })()}
        {!vibe.project && (() => {
          const firstUrl = extractFirstUrl(vibe.content);
          return firstUrl ? <LinkPreview url={firstUrl} /> : null;
        })()}
      </div>
    </div>
  );
}

interface OGData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const IMAGE_EXT_RE = /\.(png|jpg|jpeg|gif|webp|svg|avif)(\?[^\s]*)?$/i;

function extractImageUrls(text: string): string[] {
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  return urls.filter(u => IMAGE_EXT_RE.test(u));
}

function extractFirstUrl(text: string): string | null {
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  // Skip image URLs — those are rendered inline
  const nonImage = urls.find(u => !IMAGE_EXT_RE.test(u));
  return nonImage || null;
}

function LinkPreview({ url }: { url: string }) {
  const [og, setOg] = useState<OGData | null>(null);

  useEffect(() => {
    fetch(`/api/og?url=${encodeURIComponent(url)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setOg(data); })
      .catch(() => {});
  }, [url]);

  if (!og) return null;

  const domain = new URL(url).hostname.replace('www.', '');

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-3 rounded-lg border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-sm"
      style={{ borderColor: 'var(--color-warm-border)', backgroundColor: '#FDFCFB' }}
    >
      {og.image && (
        <div
          className="w-full h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${og.image})`, backgroundColor: '#F5F0EB' }}
        />
      )}
      <div className="p-3">
        {og.title && (
          <div className="text-sm font-medium line-clamp-1" style={{ color: 'var(--color-text)' }}>
            {og.title}
          </div>
        )}
        {og.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
            {og.description}
          </p>
        )}
        <div className="text-[10px] mt-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          {domain}
        </div>
      </div>
    </a>
  );
}

function ProjectCard({ project, session }: { project: VibeProject; session?: SessionSummary | null }) {
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  const projectTitle = project.title || project.name || 'Untitled';

  useEffect(() => {
    if (project.preview || session?.thumbnail) return;
    fetch(`/api/og?url=${encodeURIComponent(project.url)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.image) setOgImage(data.image); })
      .catch(() => {});
  }, [project.url, project.preview, session?.thumbnail]);

  const thumbnail = project.preview || session?.thumbnail || ogImage;

  return (
    <>
      <div
        className="block mt-3 rounded-lg border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-sm"
        style={{ borderColor: 'var(--color-warm-border)', backgroundColor: '#FDFCFB' }}
      >
        {thumbnail && (
          <div className="relative">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <div
                className="w-full h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${thumbnail})`, backgroundColor: '#F5F0EB' }}
              />
            </a>
            {session && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReplay(true); }}
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group"
                title="Watch how it was built"
              >
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                {projectTitle} <span className="text-xs">&#8599;</span>
              </span>
            </a>
            {session && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReplay(true); }}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors hover:opacity-80"
                style={{
                  backgroundColor: '#1C1917',
                  color: '#86EFAC',
                  fontFamily: 'var(--font-mono)',
                }}
                title="Watch session replay"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                replay
                {session.duration && <span style={{ opacity: 0.6 }}>{session.duration}</span>}
              </button>
            )}
          </div>
          {project.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
              {project.description}
            </p>
          )}
          {session && !thumbnail && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReplay(true); }}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 mt-2 rounded-full transition-all hover:scale-105"
              style={{
                backgroundColor: '#1C1917',
                color: '#86EFAC',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch replay
              {session.duration && <span style={{ opacity: 0.6 }}>{session.duration}</span>}
            </button>
          )}
        </div>
      </div>
      {showReplay && (
        <SessionReplayModal
          slug={session!.slug}
          title={session!.title}
          duration={session?.duration}
          promptCount={session?.prompt_count}
          onClose={() => setShowReplay(false)}
        />
      )}
    </>
  );
}

function HeartButton({ vibeId, initialCount, initialReacted }: { vibeId: string; initialCount: number; initialReacted: boolean }) {
  const { apiKey, username } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [reacted, setReacted] = useState(initialReacted);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!apiKey || busy) return;
    setBusy(true);
    // Optimistic update
    setReacted(!reacted);
    setCount(c => reacted ? c - 1 : c + 1);

    try {
      const res = await fetch(`/api/vibes/${vibeId}/react`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        // Revert on failure
        setReacted(reacted);
        setCount(count);
      }
    } catch {
      setReacted(reacted);
      setCount(count);
    }
    setBusy(false);
  };

  return (
    <button
      onClick={username ? toggle : undefined}
      className="flex items-center gap-1 text-xs transition-colors hover:opacity-70"
      style={{ fontFamily: 'var(--font-mono)', color: reacted ? '#e11d48' : 'var(--color-text-muted)' }}
      title={username ? (reacted ? 'Remove heart' : 'Heart this') : 'Join to react'}
    >
      <span style={{ fontSize: 14 }}>{reacted ? '\u2665' : '\u2661'}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

function ShareButtons({ post }: { post: Vibe }) {
  const [copied, setCopied] = useState(false);
  const vibeUrl = `https://codevibing.com/feed#${post.id}`;
  const shareText = `@${post.author}: ${post.content.slice(0, 200)}${post.content.length > 200 ? '...' : ''}`;
  const projectUrl = post.project?.url;

  const shareUrl = projectUrl || vibeUrl;
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs transition-colors hover:opacity-70"
        style={{ color: 'var(--color-text-muted)' }}
        title="Share on X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs transition-colors hover:opacity-70"
        style={{ color: 'var(--color-text-muted)' }}
        title="Share on WhatsApp"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button
        onClick={copyLink}
        className="text-xs transition-colors hover:opacity-70"
        style={{ color: copied ? 'var(--color-accent)' : 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
        title="Copy link"
      >
        {copied ? 'copied!' : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
      </button>
    </div>
  );
}

export function ThreadedPost({ post, replies, community, heartCount = 0, hearted = false, sessions }: ThreadedPostProps) {
  const { apiKey, username } = useAuth();
  const router = useRouter();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !apiKey || !username) return;

    setPosting(true);
    try {
      const res = await fetch('/api/vibes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          author: username,
          bot: 'web',
          replyTo: post.id,
          community: community || null,
        }),
      });

      if (res.ok) {
        setReplyContent('');
        setShowReply(false);
        router.refresh();
      }
    } catch {
      // silent fail
    }
    setPosting(false);
  };

  return (
    <div
      className="rounded-xl border"
      style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
    >
      {/* Main post */}
      <div className="p-4">
        <PostContent vibe={post} sessions={sessions} />

        {/* Actions */}
        <div className="mt-3 ml-11 flex items-center gap-4">
          <HeartButton vibeId={post.id} initialCount={heartCount} initialReacted={hearted} />
          {username ? (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs transition-colors hover:opacity-70"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
            >
              {showReply ? 'cancel' : 'reply'}
            </button>
          ) : (
            <Link
              href="/join"
              className="text-xs transition-colors hover:opacity-70"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
            >
              join to reply
            </Link>
          )}
          {replies.length > 0 && (
            <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
          <ShareButtons post={post} />
        </div>

        {/* Reply form */}
        {showReply && (
          <form onSubmit={handleReply} className="mt-3 ml-11">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="w-full resize-none text-sm outline-none rounded-lg border p-3"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-warm-border)',
                backgroundColor: 'var(--color-cream)',
                fontFamily: 'var(--font-sans)',
              }}
              maxLength={2000}
              autoFocus
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={posting || !replyContent.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-opacity disabled:opacity-40"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                }}
              >
                {posting ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="border-t" style={{ borderColor: 'var(--color-warm-border)' }}>
          {replies.map((reply, i) => (
            <div key={reply.id}>
              {i > 0 && (
                <div className="border-t ml-4" style={{ borderColor: 'var(--color-warm-border)' }} />
              )}
              <div className="p-4 pl-8" style={{ backgroundColor: 'rgba(245, 240, 235, 0.3)' }}>
                <PostContent vibe={reply} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
