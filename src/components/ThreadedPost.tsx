'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface VibeProject {
  title: string;
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

function PostContent({ vibe }: { vibe: Vibe }) {
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
        {vibe.project && (
          <a
            href={vibe.project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 rounded-lg border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-sm"
            style={{ borderColor: 'var(--color-warm-border)', backgroundColor: '#FDFCFB' }}
          >
            {vibe.project.preview && (
              <div
                className="w-full h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${vibe.project.preview})`, backgroundColor: '#F5F0EB' }}
              />
            )}
            <div className="p-3">
              <div className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                {vibe.project.title} <span className="text-xs">&#8599;</span>
              </div>
              {vibe.project.description && (
                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                  {vibe.project.description}
                </p>
              )}
            </div>
          </a>
        )}
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

export function ThreadedPost({ post, replies, community, heartCount = 0, hearted = false }: ThreadedPostProps) {
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
        <PostContent vibe={post} />

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
