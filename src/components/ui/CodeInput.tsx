'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  SandpackProvider, 
  SandpackPreview,
  SandpackLayout,
  SandpackCodeEditor
} from '@codesandbox/sandpack-react';
import { toPng } from 'html-to-image';

// Default template code
const DEFAULT_CODE = `import { useState } from 'react';

export default function Component() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Hello from CodeVibing!
      </h2>
      <p className="text-gray-600 mb-4">
        This is a React component created with AI assistance.
      </p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Increment
        </button>
      </div>
    </div>
  );
}`;

export default function CodeInput({ onSubmit }: { onSubmit: (code: string, screenshot: string) => void }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isCapturing, setIsCapturing] = useState(false);
  const previewRef = useRef<HTMLElement | null>(null);
  
  // Update the DOM ref when the preview is rendered
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for(let mutation of mutations) {
        if (mutation.type === 'childList') {
          const previewElement = document.querySelector('.sp-preview-container') as HTMLElement;
          if (previewElement && !previewRef.current) {
            previewRef.current = previewElement;
          }
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || DEFAULT_CODE);
  };
  
  const captureScreenshot = async () => {
    if (!previewRef.current) {
      console.error('Preview element not found');
      return null;
    }
    
    try {
      return await toPng(previewRef.current, {
        quality: 0.95,
        backgroundColor: '#fff',
      });
    } catch (err) {
      console.error('Failed to capture screenshot:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    setIsCapturing(true);
    try {
      const screenshot = await captureScreenshot();
      if (screenshot) {
        onSubmit(code, screenshot);
      } else {
        // Handle error
        alert('Failed to capture component preview. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Component</h1>
        <p className="text-gray-600 mb-6">
          Paste your React component code from an AI assistant below, or edit the template.
        </p>
        
        <div className="h-[70vh] border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Editor Panel */}
            <div className="border-r border-gray-200">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
                <span className="text-sm font-medium text-gray-700">Component.jsx</span>
                <div className="ml-auto flex space-x-2">
                  <button 
                    onClick={() => setCode(DEFAULT_CODE)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <Editor
                height="calc(100% - 40px)"
                defaultLanguage="javascript"
                value={code}
                onChange={handleEditorChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  tabSize: 2,
                  automaticLayout: true,
                }}
              />
            </div>
            
            {/* Preview Panel */}
            <div className="bg-gray-50">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Live Preview</span>
              </div>
              <div className="h-[calc(100%-40px)] overflow-auto">
                <SandpackProvider
                  template="react"
                  files={{
                    '/App.js': `import Component from './Component';

export default function App() {
  return <Component />;
}`,
                    '/Component.js': code,
                  }}
                  theme={{
                    colors: {
                      surface1: '#ffffff',
                      surface2: '#f8f9fa',
                    },
                  }}
                >
                  <div className="h-full">
                    <SandpackLayout>
                      <SandpackPreview
                        showOpenInCodeSandbox={false}
                        showRefreshButton={true}
                      />
                    </SandpackLayout>
                  </div>
                </SandpackProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isCapturing}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isCapturing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Capturing...
            </>
          ) : (
            <>
              Continue to Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}