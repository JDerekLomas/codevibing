'use client';

import { useState } from 'react';
import { mockProjects, TOOL_COLORS } from '@/data/mockProjects';

export default function VibesPage() {
  const [filter, setFilter] = useState('all');

  const featured = mockProjects[0];
  const rest = mockProjects.slice(1);

  const filteredProjects = filter === 'all'
    ? rest
    : rest.filter(p => p.tools.some(t => t.name === filter));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
      {/* Header */}
      <header style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em' }}>codevibing</span>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#a3a3a3' }}>
          <a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>about</a>
          <a href="/share" style={{ color: 'inherit', textDecoration: 'none' }}>share</a>
        </nav>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Tagline */}
        <p style={{ color: '#525252', fontSize: '13px', marginBottom: '24px' }}>
          Things people made with AI
        </p>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {['all', 'Claude Code', 'Cursor', 'v0', 'Copilot'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: filter === f ? '#fff' : '#262626',
                color: filter === f ? '#000' : '#a3a3a3',
              }}
            >
              {f !== 'all' && (
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: TOOL_COLORS[f as keyof typeof TOOL_COLORS] || '#666'
                }} />
              )}
              {f === 'all' ? 'All' : f.replace(' Code', '')}
            </button>
          ))}
        </div>

        {/* Featured + Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 200px)',
          gap: '12px',
          marginBottom: '48px'
        }}>
          {/* Featured card - 2x2 */}
          <a
            href={featured.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              gridColumn: 'span 2',
              gridRow: 'span 2',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <img
              src={featured.preview.poster || featured.preview.src}
              alt={featured.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)'
            }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {featured.tools.map((tool) => (
                  <span
                    key={tool.name}
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: tool.color,
                      color: tool.name === 'v0' ? '#fff' : '#000'
                    }}
                  >
                    {tool.name.replace(' Code', '')}
                  </span>
                ))}
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '6px',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>
                {featured.title}
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.8)',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                lineHeight: 1.4
              }}>
                {featured.description}
              </p>
            </div>
          </a>

          {/* First 4 regular cards */}
          {filteredProjects.slice(0, 4).map((project) => (
            <OverlayCard key={project.id} project={project} />
          ))}
        </div>

        {/* Rest of the grid */}
        {filteredProjects.length > 4 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            {filteredProjects.slice(4).map((project) => (
              <OverlayCard key={project.id} project={project} height="200px" />
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <p style={{ color: '#525252', textAlign: 'center', padding: '48px' }}>
            No projects with that tool yet.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#404040' }}>
          No likes. No algorithms. Just vibes.
        </p>
      </footer>
    </div>
  );
}

function OverlayCard({ project, height = '100%' }: { project: typeof mockProjects[0]; height?: string }) {
  return (
    <a
      href={project.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        height,
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        display: 'block',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <img
        src={project.preview.poster || project.preview.src}
        alt={project.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
      }} />
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
          {project.tools.map((tool) => (
            <span
              key={tool.name}
              style={{
                fontSize: '9px',
                fontWeight: 500,
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: tool.color,
                color: tool.name === 'v0' ? '#fff' : '#000'
              }}
            >
              {tool.name.replace(' Code', '')}
            </span>
          ))}
        </div>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          marginBottom: '2px'
        }}>
          {project.title}
        </h3>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {project.description}
        </p>
      </div>
    </a>
  );
}
