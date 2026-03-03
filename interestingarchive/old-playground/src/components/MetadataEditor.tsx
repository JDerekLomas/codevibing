'use client';

import { useState, useEffect } from 'react';
import { generateMetadata } from '@/lib/generateMetadata';

export interface ProjectMetadata {
  title: string;
  description: string;
  tags: string[];
  aiTool?: string;
  authorName?: string;
}

interface MetadataEditorProps {
  code: string;
  metadata?: ProjectMetadata;
  onMetadataChange: (metadata: ProjectMetadata) => void;
}

export default function MetadataEditor({ 
  code, 
  metadata: initialMetadata,
  onMetadataChange 
}: MetadataEditorProps) {
  // Generate metadata if not provided
  const [metadata, setMetadata] = useState<ProjectMetadata>(
    initialMetadata || {
      title: '',
      description: '',
      tags: [],
      aiTool: undefined,
      authorName: ''
    }
  );
  
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(!initialMetadata);

  // Generate metadata when component mounts if no initial metadata
  useEffect(() => {
    if (!initialMetadata && code) {
      generateAndSetMetadata();
    }
  }, [code, initialMetadata]);

  // Generate metadata from code
  const generateAndSetMetadata = () => {
    setIsGenerating(true);
    try {
      const generatedMetadata = generateMetadata(code);
      const updatedMetadata = {
        ...metadata,
        title: generatedMetadata.title || metadata.title,
        description: generatedMetadata.description || metadata.description,
        tags: generatedMetadata.tags || metadata.tags,
        aiTool: generatedMetadata.aiTool || metadata.aiTool
      };
      
      setMetadata(updatedMetadata);
      onMetadataChange(updatedMetadata);
    } catch (error) {
      console.error('Error generating metadata:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update parent component when metadata changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedMetadata = { ...metadata, [name]: value };
    setMetadata(updatedMetadata);
    onMetadataChange(updatedMetadata);
  };

  // Add a new tag
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // Prevent duplicate tags
    if (metadata.tags.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    
    const updatedTags = [...metadata.tags, tagInput.trim()];
    const updatedMetadata = { ...metadata, tags: updatedTags };
    setMetadata(updatedMetadata);
    onMetadataChange(updatedMetadata);
    setTagInput('');
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const updatedTags = metadata.tags.filter(tag => tag !== tagToRemove);
    const updatedMetadata = { ...metadata, tags: updatedTags };
    setMetadata(updatedMetadata);
    onMetadataChange(updatedMetadata);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-600 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Component Details</h2>
        </div>
        <button
          onClick={generateAndSetMetadata}
          disabled={isGenerating}
          className="text-sm flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-gray-700 transition-colors border border-gray-200"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Auto-Generate
            </>
          )}
        </button>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={metadata.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Component title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={metadata.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Describe what your component does"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tags
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-700 hover:text-blue-900 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* AI Tool */}
          <div>
            <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AI Tool Used
            </label>
            <select
              id="aiTool"
              name="aiTool"
              value={metadata.aiTool || ''}
              onChange={(e) => {
                const updatedMetadata = { 
                  ...metadata, 
                  aiTool: e.target.value === '' ? undefined : e.target.value 
                };
                setMetadata(updatedMetadata);
                onMetadataChange(updatedMetadata);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="">Select AI Tool</option>
              <option value="Claude">Claude</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Copilot">GitHub Copilot</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Author */}
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Name (optional)
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={metadata.authorName || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Your name"
            />
          </div>
        </div>
      </div>
    </div>
  );
}