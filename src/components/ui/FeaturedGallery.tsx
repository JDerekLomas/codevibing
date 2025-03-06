'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projectService } from '@/lib/projectService';

interface FeaturedGalleryProps {
  limit?: number;
}

export default function FeaturedGallery({ limit = 6 }: FeaturedGalleryProps) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await projectService.getProjects();
        setProjects(allProjects.slice(0, limit));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [limit]);

  // Example project data when no real projects exist
  const placeholderProjects = [
    {
      id: '1',
      title: 'Animated Menu Button',
      description: 'A clean, animated hamburger menu button with smooth transitions.',
      screenshot: '/placeholders/menu.png',
      tags: ['Animation', 'UI', 'Interaction'],
      authorName: 'Sarah Chen',
      createdAt: new Date('2025-02-15')
    },
    {
      id: '2',
      title: 'Data Table Component',
      description: 'Responsive table with sorting, filtering, and pagination.',
      screenshot: '/placeholders/table.png',
      tags: ['Data', 'Table', 'Sorting'],
      authorName: 'Jason Park',
      createdAt: new Date('2025-02-14')
    },
    {
      id: '3',
      title: 'Notification System',
      description: 'Toast notifications with different styles for success, error, and info alerts.',
      screenshot: '/placeholders/notification.png',
      tags: ['Notification', 'Toast', 'Alert'],
      authorName: 'Alex Rivera',
      createdAt: new Date('2025-02-13')
    },
    {
      id: '4',
      title: 'Image Carousel',
      description: 'Smooth image carousel with touch support and keyboard navigation.',
      screenshot: '/placeholders/carousel.png',
      tags: ['Carousel', 'Images', 'Gallery'],
      authorName: 'Mei Wong',
      createdAt: new Date('2025-02-12')
    },
    {
      id: '5',
      title: 'Modal Dialog',
      description: 'Accessible modal dialog with focus trapping and keyboard navigation.',
      screenshot: '/placeholders/modal.png',
      tags: ['Modal', 'Dialog', 'Accessibility'],
      authorName: 'Chris Johnson',
      createdAt: new Date('2025-02-11')
    },
    {
      id: '6',
      title: 'Drag and Drop List',
      description: 'Sortable list with smooth drag and drop animations.',
      screenshot: '/placeholders/dnd.png',
      tags: ['DnD', 'Sortable', 'List'],
      authorName: 'Maria Garcia',
      createdAt: new Date('2025-02-10')
    }
  ];

  // Use placeholder data when no projects are available
  const displayProjects = projects.length > 0 ? projects : placeholderProjects;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
      {displayProjects.map((project) => (
        <div key={project.id} className="group relative">
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
            {project.screenshot ? (
              <img 
                src={project.screenshot} 
                alt={project.title}
                className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                <Link href={`/project/${project.id}`}>
                  <span aria-hidden="true" className="absolute inset-0"></span>
                  {project.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>{project.authorName || 'Anonymous'}</span>
            <span className="mx-1">•</span>
            <time dateTime={project.createdAt.toISOString()}>
              {new Date(project.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}