'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { projectService } from '@/lib/projectService';
import Playground from './Playground';

interface ProjectDetailProps {
  id: string;
  project?: Project;
}

export default function ProjectDetail({ id, project: initialProject }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(initialProject || null);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState('');
  
  // Get the project from storage if not provided
  useEffect(() => {
    if (!initialProject) {
      loadProject();
    }
    
    // Record a view
    if (id) {
      projectService.recordView(id).catch(err => {
        console.error('Failed to record view:', err);
      });
    }
  }, [id, initialProject]);
  
  const loadProject = async () => {
    setLoading(true);
    try {
      const loadedProject = await projectService.getProject(id);
      setProject(loadedProject);
      if (!loadedProject) {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = async () => {
    if (!project) return;
    
    try {
      await projectService.likeProject(project.id);
      setProject({
        ...project,
        likes: (project.likes || 0) + 1
      });
    } catch (err) {
      console.error('Failed to like project:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        Loading project...
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-6">{error || 'Project not found'}</p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-8">
      {/* Project header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              {project.authorName && (
                <span className="mr-4">by {project.authorName}</span>
              )}
              {project.aiTool && (
                <span className="mr-4">Created with {project.aiTool}</span>
              )}
              <time dateTime={project.createdAt.toISOString()}>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).format(project.createdAt)}
              </time>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">❤️</span>
              <span>{project.likes || 0}</span>
            </button>
            
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-xl">👁️</span>
              <span>{project.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Playground */}
      <Playground initialCode={project.code} />
    </div>
  );
}