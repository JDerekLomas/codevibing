import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
  SandpackConsole,
} from '@codesandbox/sandpack-react';
import { toPng } from 'html-to-image';

type ExampleType = 'basic' | 'counter' | 'todo';

const examples: Record<ExampleType, string> = {
  basic: `export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Hello from CodeVibing!
      </h1>
      <p className="text-gray-600">
        Edit this code to see it update in real-time.
      </p>
    </div>
  );
}`,
  counter: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">
        React Counter
      </h1>
      <p className="text-4xl mb-4">{count}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setCount(c => c + 1)}
      >
        Increment
      </button>
    </div>
  );
}`,
  todo: `import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 mr-2 rounded"
          placeholder="Add a todo"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="bg-gray-100 p-2 rounded flex justify-between"
          >
            {todo}
            <button
              onClick={() => setTodos(todos.filter((_, i) => i !== index))}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`
};

interface PlaygroundProps {
  initialCode?: string;
  onSave?: (code: string, screenshot: string) => Promise<void>;
}

export default function Playground({ initialCode, onSave }: PlaygroundProps) {
  const [code, setCode] = useState(initialCode || examples.basic);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [consoleVisible, setConsoleVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load code from URL hash or use default
  useEffect(() => {
    if (!initialCode) {
      const hash = window.location.hash.slice(1);
      if (hash) {
        try {
          const decoded = decodeURIComponent(atob(hash));
          setCode(decoded);
        } catch {
          setCode(examples.basic);
        }
      }
    }
  }, [initialCode]);

  // Update URL when code changes
  useEffect(() => {
    if (!initialCode) {
      const encoded = btoa(encodeURIComponent(code));
      window.history.replaceState(null, '', `#${encoded}`);
    }
  }, [code, initialCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
    }
  };

  const captureScreenshot = useCallback(async () => {
    const preview = document.querySelector('.sandbox-preview');
    if (!preview) throw new Error('Preview element not found');
    
    try {
      const dataUrl = await toPng(preview as HTMLElement, {
        quality: 0.95,
        backgroundColor: '#fff',
      });
      return dataUrl;
    } catch (err) {
      console.error('Failed to capture screenshot:', err);
      throw err;
    }
  }, []);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      const screenshot = await captureScreenshot();
      await onSave(code, screenshot);
    } catch (err) {
      console.error('Failed to save:', err);
      setError('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const files = {
    '/App.js': code,
  };

  return (
    <div className="h-[80vh] flex flex-col rounded-xl overflow-hidden border border-gray-300 shadow-lg">
      <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              CodeVibing
            </h1>
            <p className="text-sm text-blue-300">Instant React Playground</p>
          </div>
          <div className="flex gap-2 items-center">
            <select
              className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setCode(examples[e.target.value as ExampleType])}
            >
              <option value="" disabled selected>Select Example</option>
              <option value="basic">Basic Component</option>
              <option value="counter">Counter Component</option>
              <option value="todo">Todo List Component</option>
            </select>
            <div className="h-8 w-px bg-gray-700 mx-1"></div>
            <button
              onClick={handleCopy}
              className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 border border-gray-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copyStatus}
            </button>
            <button
              onClick={() => setConsoleVisible(!consoleVisible)}
              className={`bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-700 border border-gray-700 transition-colors flex items-center ${
                consoleVisible ? 'bg-gray-700' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Console
            </button>
            {onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors flex items-center ml-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Project
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex min-h-[400px]">
        {/* Editor Pane with title */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-800 text-gray-200 py-2 px-4 flex items-center text-xs font-medium border-b border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            App.js
            <span className="ml-2 px-2 py-0.5 bg-blue-900 text-blue-200 rounded-full text-xs">React</span>
          </div>
          <div className="flex-1 relative border-r border-gray-700">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                setCode(value || '');
                setError('');
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                tabSize: 2,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
              }}
              className="absolute inset-0" // Ensure editor fills the container
            />
            {error && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-900 text-red-100 p-3 text-sm border-t border-red-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Preview Pane */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-100 text-gray-700 py-2 px-4 flex items-center justify-between text-xs font-medium border-b border-gray-300">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
          </div>
        
          <SandpackProvider
            template="react"
            files={files}
            theme={{
              colors: {
                surface1: '#ffffff',
                surface2: '#f8f9fa',
              },
            }}
          >
            <SandpackLayout>
              <div className={`sandbox-preview ${consoleVisible ? 'h-2/3' : 'flex-1'}`}>
                <SandpackPreview 
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                  style={{ height: '100%' }}
                />
              </div>
              {consoleVisible && (
                <div className="h-1/3 border-t border-gray-300">
                  <div className="bg-gray-800 text-gray-200 py-1 px-4 flex items-center text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Console Output
                  </div>
                  <SandpackConsole resetOnPreviewRestart={true} />
                </div>
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-50 to-blue-50 text-center p-4 text-sm text-gray-600 border-t border-gray-200">
        <p className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share your creation by copying the URL!
        </p>
      </footer>
    </div>
  );
}