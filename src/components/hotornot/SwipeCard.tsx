'use client';

import { useRef, useState, useCallback } from 'react';

interface SwipeCardProps {
  title: string;
  description: string | null;
  descriptionLong: string | null;
  preview: string | null;
  author: string;
  url: string;
  onSwipe: (direction: 'left' | 'right') => void;
  overlay?: { hot_percent: number; total_votes: number } | null;
  exiting?: 'left' | 'right' | null;
}

export default function SwipeCard({ title, description, descriptionLong, preview, author, url, onSwipe, overlay, exiting }: SwipeCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleStart = useCallback((clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
    setDragging(true);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    setDragX(clientX - startX.current);
  }, []);

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    if (Math.abs(dragX) > 100) {
      onSwipe(dragX > 0 ? 'right' : 'left');
    }
    setDragX(0);
  }, [dragX, onSwipe]);

  const rotation = dragX * 0.08;

  let transform = `translateX(${dragX}px) rotate(${rotation}deg)`;
  if (exiting === 'left') transform = 'translateX(-120%) rotate(-15deg)';
  if (exiting === 'right') transform = 'translateX(120%) rotate(15deg)';

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing select-none flex flex-col"
      style={{
        backgroundColor: 'white',
        borderColor: 'var(--color-warm-border)',
        boxShadow: dragging ? '0 10px 40px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
        transform,
        opacity: overlay ? 0.95 : 1,
        transition: exiting || !dragging ? 'transform 0.4s ease, opacity 0.4s ease' : 'none',
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('[data-accordion]')) return;
        handleStart(e.clientX);
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (isDragging.current) handleEnd(); }}
      onTouchStart={(e) => {
        if ((e.target as HTMLElement).closest('[data-accordion]')) return;
        handleStart(e.touches[0].clientX);
      }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Project image or gradient — shrinks when expanded */}
      <div
        className="relative w-full flex-shrink-0 transition-all duration-300"
        style={{ height: expanded ? '35%' : '55%' }}
      >
        {preview ? (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${preview})` }} />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #E8E2DA 50%, #D4C9BD 100%)' }}
          >
            <span
              className="text-2xl font-medium text-center px-6 leading-snug"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {title}
            </span>
          </div>
        )}

        {/* Swipe direction indicators */}
        {dragX > 40 && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg border-2 font-bold text-sm" style={{ borderColor: '#16a34a', color: '#16a34a', transform: 'rotate(-15deg)' }}>
            HOT
          </div>
        )}
        {dragX < -40 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg border-2 font-bold text-sm" style={{ borderColor: '#dc2626', color: '#dc2626', transform: 'rotate(15deg)' }}>
            NOT
          </div>
        )}
      </div>

      {/* Card info — takes remaining space */}
      <div className="flex-1 flex flex-col p-4 min-h-0">
        {/* Title + headline — always visible */}
        <h3
          className="text-base font-medium leading-tight mb-0.5 flex-shrink-0"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="text-sm leading-snug flex-shrink-0"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        )}

        {/* Accordion — long description */}
        {descriptionLong && (
          <div data-accordion className="mt-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="text-xs flex items-center gap-1 hover:underline cursor-pointer"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
            >
              <span
                className="inline-block transition-transform duration-200"
                style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                &#9656;
              </span>
              {expanded ? 'less' : 'more'}
            </button>
            {expanded && (
              <p
                className="text-xs leading-relaxed mt-1 overflow-y-auto"
                style={{ color: 'var(--color-text-muted)', maxHeight: '80px' }}
              >
                {descriptionLong}
              </p>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Author + visit — pinned to bottom */}
        <div className="flex items-center justify-between flex-shrink-0">
          <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            @{author}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
            onClick={(e) => e.stopPropagation()}
          >
            visit &rarr;
          </a>
        </div>
      </div>

      {/* Score reveal overlay */}
      {overlay && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl"
          style={{ backgroundColor: 'rgba(28, 25, 23, 0.85)' }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'white' }}>
              {overlay.hot_percent}% hot
            </div>
            <div className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)' }}>
              {overlay.total_votes} vote{overlay.total_votes !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
