'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Playground = dynamic(() => import('@/components/Playground'), {
  ssr: false,
});

export default function PlaygroundPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading playground...</p>
        </div>
      </div>
    }>
      <Playground />
    </Suspense>
  );
}