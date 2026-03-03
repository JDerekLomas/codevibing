'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Playground from './Playground';
import MetadataEditor, { ProjectMetadata } from './MetadataEditor';
import { projectService } from '@/lib/projectService';

interface PublishFormProps {
  initialCode?: string;
}

export default function PublishForm({ initialCode }: PublishFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode || '');
  const [screenshot, setScreenshot] = useState('');
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    title: '',
    description: '',
    tags: [],
    aiTool: undefined,
    authorName: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const handleSave = async (code: string, screenshot: string) => {
    setCode(code);
    setScreenshot(screenshot);
  };
  
  const handleMetadataChange = (newMetadata: ProjectMetadata) => {
    setMetadata(newMetadata);
  };
  
  const handlePublish = async () => {
    if (!code) {
      setError('Please add some code to your component');
      return;
    }
    
    if (!screenshot) {
      setError('Please generate a screenshot of your component');
      return;
    }
    
    if (!metadata.title) {
      setError('Please add a title for your component');
      return;
    }
    
    if (!metadata.description) {
      setError('Please add a description for your component');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      const project = await projectService.saveProject({
        title: metadata.title,
        description: metadata.description,
        code,
        screenshot,
        tags: metadata.tags,
        authorName: metadata.authorName || undefined,
        aiTool: metadata.aiTool
      });
      
      // Redirect to the project page
      router.push(`/project/${project.id}`);
    } catch (err) {
      console.error('Failed to publish project:', err);
      setError('Failed to publish project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex flex-col p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md border border-blue-100 rounded-xl">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 bg-blue-600 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create with AI</h2>
        </div>
        <p className="text-gray-700 ml-12 leading-relaxed">
          Paste your React component code from Claude, ChatGPT, or other AI assistants below.
          Edit and preview in real-time, then click <span className="font-semibold text-blue-700">Save Project</span> to
          generate a screenshot and prepare for publishing.
        </p>
      </div>
      
      <div className="transition-all duration-300 transform hover:shadow-lg">
        <Playground initialCode={code} onSave={handleSave} />
      </div>
      
      {screenshot && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Publish Your Component</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MetadataEditor 
              code={code} 
              metadata={metadata} 
              onMetadataChange={handleMetadataChange} 
            />
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              
              <div className="bg-gray-100 rounded overflow-hidden mb-6 aspect-video">
                {screenshot && (
                  <img 
                    src={screenshot} 
                    alt="Component preview" 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Publishing...' : 'Publish Component'}
              </button>
              
              {error && (
                <div className="mt-4 text-red-500 text-sm">{error}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}