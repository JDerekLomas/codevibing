import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  screenshot: string;
  demoUrl?: string;
  tags: string[];
  authorName?: string;
  createdAt: Date;
}

export default function ProjectCard({
  title,
  description,
  screenshot,
  demoUrl,
  tags,
  authorName,
  createdAt,
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="project-card group bg-white rounded-lg overflow-hidden shadow-md">
      {/* Screenshot */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={screenshot}
          alt={title}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 loading-skeleton" />
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {demoUrl && (
            <Link
              href={demoUrl}
              className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Try it live
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          {authorName && (
            <span>by {authorName}</span>
          )}
          <time dateTime={createdAt.toISOString()}>
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
            }).format(createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
}