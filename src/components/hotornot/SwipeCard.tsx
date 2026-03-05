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
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startX.current = clientX;
    startY.current = clientY;
    isDragging.current = true;
    setDragging(true);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    const dx = clientX - startX.current;
    setDragX(dx);
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
  const opacity = overlay ? 0.95 : 1;

  let transform = `translateX(${dragX}px) rotate(${rotation}deg)`;
  if (exiting === 'left') transform = 'translateX(-120%) rotate(-15deg)';
  if (exiting === 'right') transform = 'translateX(120%) rotate(15deg)';

  const imageHeight = expanded ? '40%' : '60%';
  const infoHeight = expanded ? '60%' : '40%';

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        backgroundColor: 'white',
        borderColor: 'var(--color-warm-border)',
        boxShadow: dragging ? '0 10px 40px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
        transform,
        opacity,
        transition: exiting || !dragging ? 'transform 0.4s ease, opacity 0.4s ease' : 'none',
      }}
      onMouseDown={(e) => {
        // Don't start drag on the accordion area
        if ((e.target as HTMLElement).closest('[data-accordion]')) return;
        handleStart(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (isDragging.current) handleEnd(); }}
      onTouchStart={(e) => {
        if ((e.target as HTMLElement).closest('[data-accordion]')) return;
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Project image or gradient placeholder */}
      <div className="relative w-full transition-all duration-300" style={{ height: imageHeight }}>
        {preview ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #F5F0EB 0%, #E8E2DA 50%, #D4C9BD 100%)',
            }}
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

      {/* Card info */}
      <div className="p-5 flex flex-col transition-all duration-300 overflow-hidden" style={{ height: infoHeight }}>
        <div className="flex-1 min-h-0 overflow-hidden">
          <h3
            className="text-lg font-medium mb-1 leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {description}
            </p>
          )}

          {/* Accordion for long description */}
          {descriptionLong && (
            <div data-accordion className="mt-1.5">
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
                  className="text-xs leading-relaxed mt-1.5 overflow-y-auto"
                  style={{ color: 'var(--color-text-muted)', maxHeight: '100px' }}
                >
                  {descriptionLong}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 flex-shrink-0">
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
