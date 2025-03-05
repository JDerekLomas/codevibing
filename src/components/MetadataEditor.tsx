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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Component Details</h2>
        <button
          onClick={generateAndSetMetadata}
          disabled={isGenerating}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={metadata.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Component title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={metadata.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what your component does"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* AI Tool */}
        <div>
          <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select AI Tool</option>
            <option value="Claude">Claude</option>
            <option value="ChatGPT">ChatGPT</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name (optional)
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={metadata.authorName || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
          />
        </div>
      </div>
    </div>
  );
}