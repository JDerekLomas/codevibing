'use client';

import { useState, useEffect, useCallback } from 'react';
import SwipeCard from './SwipeCard';
import VoteButtons from './VoteButtons';
import EmptyState from './EmptyState';

interface Project {
  id: string;
  title: string;
  url: string;
  description: string | null;
  description_long: string | null;
  preview: string | null;
  author: string;
}

function getVoterId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('cv_voter_id');
  if (!id) {
    id = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('cv_voter_id', id);
  }
  // Use logged-in username if available
  try {
    const auth = localStorage.getItem('cv_auth');
    if (auth) {
      const parsed = JSON.parse(auth);
      if (parsed.username) return parsed.username;
    }
  } catch { /* ignore */ }
  return id;
}

export default function SwipeStack(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalRated, setTotalRated] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [overlay, setOverlay] = useState<{ hot_percent: number; total_votes: number } | null>(null);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const [voterId, setVoterId] = useState('');

  const fetchProjects = useCallback(async (vid: string) => {
    try {
      const res = await fetch(`/api/hotornot/next?voter_id=${encodeURIComponent(vid)}&count=10`);
      const data = await res.json();
      setProjects(data.projects || []);
      setTotalProjects((data.projects || []).length + totalRated);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const vid = getVoterId();
    setVoterId(vid);
    if (vid) fetchProjects(vid);
  }, [fetchProjects]);

  const handleVote = useCallback(async (score: 0 | 1) => {
    const project = projects[currentIndex];
    if (!project || voting) return;

    setVoting(true);
    const direction = score === 1 ? 'right' : 'left';

    try {
      const res = await fetch('/api/hotornot/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id, voter_id: voterId, score }),
      });
      const data = await res.json();

      // Show score overlay
      setOverlay({ hot_percent: data.hot_percent, total_votes: data.total_votes });

      // After delay, animate card exit
      setTimeout(() => {
        setOverlay(null);
        setExiting(direction);

        setTimeout(() => {
          setExiting(null);
          setCurrentIndex(prev => prev + 1);
          setTotalRated(prev => prev + 1);
          setVoting(false);
        }, 400);
      }, 600);
    } catch (err) {
      console.error('Vote failed:', err);
      setVoting(false);
    }
  }, [projects, currentIndex, voting, voterId]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    handleVote(direction === 'right' ? 1 : 0);
  }, [handleVote]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (voting) return;
      if (e.key === 'ArrowLeft') handleVote(0);
      if (e.key === 'ArrowRight') handleVote(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleVote, voting]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-sm animate-pulse" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Loading projects...
        </div>
      </div>
    );
  }

  const currentProject = projects[currentIndex];
  const isFinished = !currentProject;

  if (isFinished) {
    return <EmptyState totalRated={totalRated} />;
  }

  const progress = totalRated;
  const total = projects.length + totalRated;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            Rated {progress} of {total}
          </span>
          <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            &#8592; &#8594; arrow keys
          </span>
        </div>
        <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--color-warm-border)' }}>
          <div
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: `${total > 0 ? (progress / total) * 100 : 0}%`,
              backgroundColor: 'var(--color-accent)',
            }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative mx-auto" style={{ maxWidth: '400px', height: '480px' }}>
        {/* Background card for depth effect */}
        {currentIndex + 1 < projects.length && (
          <div
            className="absolute inset-0 rounded-xl border"
            style={{
              backgroundColor: 'white',
              borderColor: 'var(--color-warm-border)',
              transform: 'scale(0.95) translateY(8px)',
              opacity: 0.5,
            }}
          />
        )}

        {/* Current card */}
        <SwipeCard
          title={currentProject.title}
          description={currentProject.description}
          descriptionLong={currentProject.description_long}
          preview={currentProject.preview}
          author={currentProject.author}
          url={currentProject.url}
          onSwipe={handleSwipe}
          overlay={overlay}
          exiting={exiting}
        />
      </div>

      {/* Vote buttons */}
      <VoteButtons onVote={handleVote} disabled={voting} />
    </div>
  );
}
