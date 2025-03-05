'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

const GalleryGrid = dynamic(() => import('@/components/GalleryGrid'), {
  ssr: false
});

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Component Gallery</h1>
          <Link 
            href="/playground" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create New
          </Link>
        </div>
        
        {/* Search bar */}
        <div className="mb-12">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search components by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Gallery grid */}
        <Suspense fallback={
          <div className="py-12 text-center text-gray-500">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading gallery...</p>
          </div>
        }>
          <GalleryGrid filter={searchQuery} />
        </Suspense>
      </div>
    </div>
  );
}