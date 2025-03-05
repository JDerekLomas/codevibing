import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GalleryGrid = dynamic(() => import('@/components/GalleryGrid'), {
  ssr: false
});

/**
 * Home Page Component
 * 
 * This is the main landing page of the CodeVibing platform, designed with 
 * Scandinavian minimalist principles:
 * - Clean typography with ample white space
 * - Neutral color palette (whites, grays)
 * - Simple grid layout with clear visual hierarchy
 * - High contrast text-to-background ratio
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section 
          Features a clean, minimal design with strong typography and
          ample white space to emphasize the main message */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Create. Share.
              <br />
              <span className="text-gray-500">With AI assistance.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light mb-12 leading-relaxed">
              A minimalist platform for sharing and exploring AI-generated React components.
              Build beautiful interfaces faster than ever.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/playground" 
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Start Creating
              </Link>
              <Link 
                href="#gallery" 
                className="px-8 py-3 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section 
          Displays projects in a responsive grid layout with live data */}
      <div id="gallery" className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Component Gallery</h2>
            <p className="text-gray-600 max-w-3xl">
              Browse AI-generated React components shared by the community. Find inspiration,
              learn new techniques, and remix components for your own projects.
            </p>
          </div>

          {/* Gallery Grid */}
          <Suspense fallback={
            <div className="py-12 text-center text-gray-500">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading gallery...</p>
            </div>
          }>
            <GalleryGrid limit={6} />
          </Suspense>
          
          <div className="mt-12 text-center">
            <Link 
              href="/gallery" 
              className="bg-gray-100 text-gray-800 px-8 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              View All Components
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Paste AI-Generated Code</h3>
              <p className="text-gray-600">
                Paste your React component code from Claude, ChatGPT, or Copilot into our playground.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Edit & Preview</h3>
              <p className="text-gray-600">
                Preview your component in real-time, make edits, and generate metadata automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Share with Community</h3>
              <p className="text-gray-600">
                Publish your component to the gallery where others can view, like, and remix it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>© {new Date().getFullYear()} CodeVibing</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}