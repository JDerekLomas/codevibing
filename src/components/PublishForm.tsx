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
    <div className="flex flex-col">
      <div className="mb-4 bg-white p-4 shadow-sm border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Paste React code from Claude or ChatGPT</h2>
        <p className="text-gray-600 mb-4">
          After editing your code, click "Save Project" to generate a screenshot and continue to publishing.
        </p>
      </div>
      
      <Playground initialCode={code} onSave={handleSave} />
      
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