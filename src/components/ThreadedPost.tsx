'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface VibeProject {
  title: string;
  url: string;
  preview?: string;
  description?: string;
}

interface Vibe {
  id: string;
  content: string;
  author: string;
  bot: string;
  community: string | null;
  reply_to: string | null;
  project?: VibeProject | null;
  created_at: string;
}

interface ThreadedPostProps {
  post: Vibe;
  replies: Vibe[];
  community?: string;
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
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
          {vibe.content}
        </p>
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
      </div>
    </div>
  );
}

export function ThreadedPost({ post, replies, community }: ThreadedPostProps) {
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
