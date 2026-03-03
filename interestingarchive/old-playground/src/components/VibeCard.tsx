'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VibeProject } from '@/data/mockProjects';

interface VibeCardProps {
  project: VibeProject;
  size?: 'normal' | 'tall' | 'wide' | 'featured';
}

export default function VibeCard({ project, size = 'normal' }: VibeCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);

  const handleActivate = () => {
    setIsActive(true);
    if (videoRef.current && project.preview.type === 'mp4') {
      videoRef.current.play();
    }
  };

  const handleDeactivate = () => {
    setIsActive(false);
    if (videoRef.current && project.preview.type === 'mp4') {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Aspect ratios for visual variety
  const aspectClass = {
    normal: 'aspect-[4/3]',
    tall: 'aspect-[3/4]',
    wide: 'aspect-[16/9]',
    featured: 'aspect-[16/10]',
  }[size];

  // Grid span for masonry effect
  const gridClass = {
    normal: '',
    tall: 'row-span-2',
    wide: 'sm:col-span-2',
    featured: 'sm:col-span-2 row-span-2',
  }[size];

  return (
    <article
      className={`group relative overflow-hidden rounded-lg bg-neutral-900 cursor-pointer ${gridClass}`}
      onMouseEnter={handleActivate}
      onMouseLeave={handleDeactivate}
      onTouchStart={handleActivate}
      onTouchEnd={handleDeactivate}
    >
      {/* Preview container */}
      <div className={`relative w-full ${aspectClass}`}>
        {/* Static poster - always visible, fades on hover */}
        {project.preview.poster && (
          <Image
            src={project.preview.poster}
            alt={project.title}
            fill
            className={`object-cover transition-opacity duration-500 ${
              isActive ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Video - hidden by default, shows on hover */}
        {project.preview.type === 'mp4' && (
          <video
            ref={videoRef}
            src={project.preview.src}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* GIF - shows static frame, full gif on hover via CSS */}
        {project.preview.type === 'gif' && (
          <Image
            src={project.preview.src}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Dark gradient overlay - bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          {/* Tool badges */}
          <div className="flex gap-1.5 mb-2">
            {project.tools.map((tool) => (
              <span
                key={tool.name}
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: tool.color,
                  color: tool.name === 'v0' ? '#fff' : '#000',
                }}
              >
                {tool.name.replace(' Code', '')}
              </span>
            ))}
          </div>

          {/* Title - white text with shadow */}
          <h3
            className="font-semibold text-white leading-tight mb-1"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.9)',
              fontSize: size === 'featured' ? '1.25rem' : '1rem',
            }}
          >
            {project.title}
          </h3>

          {/* Stub - short description */}
          <p
            className={`text-white/80 text-sm leading-snug ${
              size === 'featured' ? 'line-clamp-2' : 'line-clamp-1'
            }`}
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {project.description}
          </p>

          {/* Tags - show on hover */}
          <div
            className={`flex gap-1.5 mt-2 transition-opacity duration-200 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons - show on hover */}
        <div
          className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}
          {project.repo && (
            <Link
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
