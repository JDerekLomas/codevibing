'use client';

import { useState, useEffect } from 'react';
import { generateMetadata } from '@/lib/generateMetadata';

export default function MetadataForm({ code, screenshot, onBack, onSubmit }) {
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: [],
    authorName: '',
    aiTool: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Auto-generate metadata on initial load
  useEffect(() => {
    generateMetadataFromCode();
  }, [code]);
  
  const generateMetadataFromCode = async () => {
    setIsGenerating(true);
    try {
      const generatedMetadata = generateMetadata(code);
      setMetadata({
        title: generatedMetadata.title || metadata.title,
        description: generatedMetadata.description || metadata.description,
        tags: generatedMetadata.tags || metadata.tags,
        aiTool: generatedMetadata.aiTool || metadata.aiTool,
        authorName: metadata.authorName
      });
    } catch (error) {
      console.error('Error generating metadata:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata({
      ...metadata,
      [name]: value
    });
  };
  
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // Prevent duplicate tags
    if (metadata.tags.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    
    setMetadata({
      ...metadata,
      tags: [...metadata.tags, tagInput.trim()]
    });
    setTagInput('');
  };
  
  const removeTag = (tagToRemove) => {
    setMetadata({
      ...metadata,
      tags: metadata.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate
    if (!metadata.title.trim() || !metadata.description.trim()) {
      alert('Please provide a title and description.');
      setIsSubmitting(false);
      return;
    }
    
    // Submit
    onSubmit(metadata);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Component Details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={metadata.title}
                onChange={handleChange}
                placeholder="Give your component a clear name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={metadata.description}
                onChange={handleChange}
                placeholder="Describe what your component does"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex">
                <input
                  id="tagInput"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              {metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Tool */}
              <div>
                <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700 mb-1">AI Tool Used</label>
                <select
                  id="aiTool"
                  name="aiTool"
                  value={metadata.aiTool || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select AI Tool</option>
                  <option value="Claude">Claude</option>
                  <option value="ChatGPT">ChatGPT</option>
                  <option value="Copilot">GitHub Copilot</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Author Name */}
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">Your Name (optional)</label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  value={metadata.authorName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={generateMetadataFromCode}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-70"
                >
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || isGenerating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish Component
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Component Preview</h2>
          
          <div className="aspect-video mb-6 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            {screenshot ? (
              <img 
                src={screenshot} 
                alt="Component preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">No preview available</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="font-medium">{metadata.title || 'Untitled Component'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-sm text-gray-700 line-clamp-3">{metadata.description || 'No description provided'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tags</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {metadata.tags.length > 0 ? (
                  metadata.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags added</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}