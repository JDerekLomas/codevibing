'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const ProjectDetail = dynamic(() => import('@/components/ProjectDetail'), {
  ssr: false,
});

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    }>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProjectDetail id={id} />
      </div>
    </Suspense>
  );
}