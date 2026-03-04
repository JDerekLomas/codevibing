'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProjectWithStats {
  id: string;
  title: string;
  url: string;
  description: string | null;
  preview: string | null;
  author: string;
  hot_count: number;
  total_votes: number;
  hot_percent: number;
  created_at: string;
}

type SortMode = 'hot' | 'new' | 'controversial';

export default function TrendingPage(): JSX.Element {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [sort, setSort] = useState<SortMode>('hot');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hotornot/stats?sort=${sort}`)
      .then(r => r.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sort]);

  const tabs: { key: SortMode; label: string }[] = [
    { key: 'hot', label: 'Hot' },
    { key: 'new', label: 'New' },
    { key: 'controversial', label: 'Controversial' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl mb-0.5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              Hot or Not: Trending
            </h1>
          </div>
          <Link
            href="/hotornot"
            className="text-xs px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5"
            style={{
              borderColor: 'var(--color-warm-border)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            &larr; Rate projects
          </Link>
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSort(tab.key)}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                backgroundColor: sort === tab.key ? 'var(--color-accent)' : 'white',
                color: sort === tab.key ? 'white' : 'var(--color-text)',
                border: sort === tab.key ? 'none' : '1px solid var(--color-warm-border)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-sm animate-pulse" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              Loading rankings...
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              No rated projects yet.
            </p>
            <Link
              href="/hotornot"
              className="text-sm px-5 py-2.5 rounded-full inline-block"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-mono)' }}
            >
              Start rating &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {projects.map((project, i) => (
              <div key={project.id}>
                {i > 0 && (
                  <div className="border-b" style={{ borderColor: 'var(--color-warm-border)' }} />
                )}
                <div className="relative py-4 flex items-center gap-4 overflow-hidden">
                  {/* Heatmap background bar */}
                  {project.total_votes > 0 && (
                    <div
                      className="absolute inset-0 opacity-[0.07] rounded-lg"
                      style={{
                        width: `${project.hot_percent}%`,
                        backgroundColor: project.hot_percent >= 50 ? '#ea580c' : '#6b7280',
                      }}
                    />
                  )}

                  {/* Rank */}
                  <div
                    className="text-2xl font-bold w-10 text-center flex-shrink-0 relative z-10"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
                  >
                    {i + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 relative z-10">
                    {project.preview ? (
                      <div
                        className="w-14 h-14 rounded-lg bg-cover bg-center border"
                        style={{ backgroundImage: `url(${project.preview})`, borderColor: 'var(--color-warm-border)' }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center border"
                        style={{ backgroundColor: '#F5F0EB', borderColor: 'var(--color-warm-border)' }}
                      >
                        <span className="text-xs" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}>
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline block truncate"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {project.title}
                    </a>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                        @{project.author}
                      </span>
                      {project.description && (
                        <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                          &middot; {project.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0 relative z-10">
                    <div
                      className="text-sm font-bold"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: project.hot_percent >= 70 ? '#ea580c' : project.hot_percent >= 50 ? 'var(--color-text)' : 'var(--color-text-muted)',
                      }}
                    >
                      {project.total_votes > 0 ? `${project.hot_percent}% hot` : '--'}
                    </div>
                    <div className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      {project.total_votes} vote{project.total_votes !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
