'use client';

import { useState } from 'react';
import VibeCard from './VibeCard';
import { VibeProject, TOOL_COLORS } from '@/data/mockProjects';

interface VibeGalleryProps {
  projects: VibeProject[];
}

const TOOL_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Claude Code', label: 'Claude', color: TOOL_COLORS['Claude Code'] },
  { id: 'Cursor', label: 'Cursor', color: TOOL_COLORS['Cursor'] },
  { id: 'v0', label: 'v0', color: TOOL_COLORS['v0'] },
  { id: 'Copilot', label: 'Copilot', color: TOOL_COLORS['Copilot'] },
];

// Assign sizes for visual variety (can be based on project properties later)
const SIZE_PATTERN: Array<'featured' | 'normal' | 'tall' | 'wide'> = [
  'featured', 'normal', 'tall', 'normal', 'wide', 'normal', 'normal', 'tall',
];

export default function VibeGallery({ projects }: VibeGalleryProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((project) => {
    // Tool filter
    if (filter !== 'all') {
      const hasMatchingTool = project.tools.some((t) => t.name === filter);
      if (!hasMatchingTool) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = project.title.toLowerCase().includes(query);
      const matchesDesc = project.description.toLowerCase().includes(query);
      const matchesTags = project.tags.some((t) => t.toLowerCase().includes(query));
      if (!matchesTitle && !matchesDesc && !matchesTags) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Minimal filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 text-sm bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500"
          />
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Tool filters - pill style */}
        <div className="flex gap-1.5 flex-wrap">
          {TOOL_FILTERS.map((toolFilter) => (
            <button
              key={toolFilter.id}
              onClick={() => setFilter(toolFilter.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-all ${
                filter === toolFilter.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {toolFilter.color && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: toolFilter.color }}
                />
              )}
              {toolFilter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-style grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
          {filteredProjects.map((project, idx) => (
            <VibeCard
              key={project.id}
              project={project}
              size={SIZE_PATTERN[idx % SIZE_PATTERN.length]}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-neutral-500 dark:text-neutral-500">
          <p className="mb-2">No projects found</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="text-sm underline hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
