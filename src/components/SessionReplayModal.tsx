'use client';

import { useState, useEffect } from 'react';

const GALLERY_BASE = 'https://codevibinggallery.vercel.app';

interface SessionReplayModalProps {
  slug: string;
  title: string;
  duration?: string | null;
  promptCount?: number | null;
  onClose: () => void;
}

export function SessionReplayModal({ slug, title, duration, promptCount, onClose }: SessionReplayModalProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-white text-sm font-medium truncate">{title}</h3>
            {duration && (
              <span className="text-white/50 text-xs" style={{ fontFamily: 'monospace' }}>
                {duration} / {promptCount} prompts
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-sm px-2 py-1"
          >
            Close
          </button>
        </div>

        {/* Player iframe */}
        <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: '#0a0a0a' }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/30 text-sm" style={{ fontFamily: 'monospace' }}>Loading replay...</div>
            </div>
          )}
          <iframe
            src={`${GALLERY_BASE}/api/session-player/${slug}`}
            className="w-full h-full border-0"
            allow="autoplay"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        </div>
      </div>
    </div>
  );
}

interface ReplayButtonProps {
  slug: string;
  title: string;
  duration?: string | null;
  promptCount?: number | null;
  variant?: 'overlay' | 'badge' | 'icon';
}

export function ReplayButton({ slug, title, duration, promptCount, variant = 'badge' }: ReplayButtonProps) {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'overlay') {
    return (
      <>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group z-10"
          title="Watch how it was built"
        >
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
        {showModal && (
          <SessionReplayModal
            slug={slug}
            title={title}
            duration={duration}
            promptCount={promptCount}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
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
        </button>
        {showModal && (
          <SessionReplayModal
            slug={slug}
            title={title}
            duration={duration}
            promptCount={promptCount}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // badge variant (default)
  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105"
        style={{
          backgroundColor: '#1C1917',
          color: '#86EFAC',
          fontFamily: 'var(--font-mono)',
        }}
        title="Watch how it was built"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch replay
        {duration && <span style={{ color: '#86EFAC', opacity: 0.6 }}>{duration}</span>}
      </button>
      {showModal && (
        <SessionReplayModal
          slug={slug}
          title={title}
          duration={duration}
          promptCount={promptCount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
