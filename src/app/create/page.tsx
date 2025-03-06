'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CodeInput from '@/components/ui/CodeInput';
import Preview from '@/components/ui/Preview';
import MetadataForm from '@/components/ui/MetadataForm';

export default function CreatePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [code, setCode] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: [],
    authorName: '',
    aiTool: ''
  });

  const handleCodeSubmit = (newCode, previewImage) => {
    setCode(newCode);
    setScreenshot(previewImage);
    setActiveStep(2);
  };

  const handleMetadataSubmit = (newMetadata) => {
    setMetadata(newMetadata);
    // Would publish to backend here
    setActiveStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with steps */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">CodeVibing</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              <nav className="flex space-x-4" aria-label="Progress">
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                  onClick={() => activeStep > 1 && setActiveStep(1)}
                >
                  1. Paste Code
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                  onClick={() => activeStep > 2 && setActiveStep(2)}
                  disabled={activeStep < 2}
                >
                  2. Add Details
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                  disabled={true}
                >
                  3. Complete
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeStep === 1 && (
          <CodeInput onSubmit={handleCodeSubmit} />
        )}
        
        {activeStep === 2 && (
          <MetadataForm 
            code={code} 
            screenshot={screenshot}
            onBack={() => setActiveStep(1)}
            onSubmit={handleMetadataSubmit}
          />
        )}
        
        {activeStep === 3 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success!</h2>
            <p className="text-lg text-gray-600 mb-8">Your component has been published to the gallery.</p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View Gallery
              </Link>
              <button 
                onClick={() => {
                  setCode('');
                  setScreenshot('');
                  setMetadata({
                    title: '',
                    description: '',
                    tags: [],
                    authorName: '',
                    aiTool: ''
                  });
                  setActiveStep(1);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}