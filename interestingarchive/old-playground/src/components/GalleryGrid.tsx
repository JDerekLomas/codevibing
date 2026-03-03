'use client';

import { useState, useEffect } from 'react';
import { ProjectSummary } from '@/lib/types';
import ProjectCard from './ProjectCard';
import { projectService } from '@/lib/projectService';

interface GalleryGridProps {
  initialProjects?: ProjectSummary[];
  filter?: string;
  limit?: number;
}

export default function GalleryGrid({ 
  initialProjects, 
  filter, 
  limit 
}: GalleryGridProps) {
  const [projects, setProjects] = useState<ProjectSummary[]>(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  
  // Load projects if not provided
  useEffect(() => {
    if (!initialProjects) {
      loadProjects();
    }
  }, [initialProjects]);
  
  // Load projects from storage
  const loadProjects = async () => {
    setLoading(true);
    try {
      let allProjects = await projectService.getProjects();
      
      // Apply filter if provided
      if (filter) {
        const filterLower = filter.toLowerCase();
        allProjects = allProjects.filter(project => 
          project.title.toLowerCase().includes(filterLower) || 
          project.description.toLowerCase().includes(filterLower) ||
          project.tags.some(tag => tag.toLowerCase().includes(filterLower))
        );
      }
      
      // Sort projects
      if (sortBy === 'latest') {
        allProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      
      // Limit the number of projects if specified
      if (limit && limit > 0) {
        allProjects = allProjects.slice(0, limit);
      }
      
      setProjects(allProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'latest' | 'popular');
  };
  
  return (
    <div className="w-full">
      {/* Sort controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {projects.length} {projects.length === 1 ? 'Component' : 'Components'}
        </h2>
        
        <select 
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-600 bg-white hover:border-gray-300 transition-colors"
        >
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-gray-500">
          Loading components...
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="py-12 text-center text-red-500">
          {error}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && projects.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No components found.
        </div>
      )}
      
      {/* Project grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            screenshot={project.screenshot}
            demoUrl={`/project/${project.id}`}
            tags={project.tags}
            authorName={project.authorName}
            createdAt={project.createdAt}
          />
        ))}
      </div>
    </div>
  );
}