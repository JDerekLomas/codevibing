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
    <div className="h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">CodeVibing</h1>
            <p className="text-sm text-gray-400">Instant React Playground</p>
          </div>
          <div className="flex gap-2">
            <select
              className="bg-gray-800 text-white px-3 py-1 rounded"
              onChange={(e) => setCode(examples[e.target.value as ExampleType])}
            >
              <option value="" disabled>Select Example</option>
              <option value="basic">Basic</option>
              <option value="counter">Counter</option>
              <option value="todo">Todo List</option>
            </select>
            <button
              onClick={handleCopy}
              className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              {copyStatus}
            </button>
            <button
              onClick={() => setConsoleVisible(!consoleVisible)}
              className={`bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 ${
                consoleVisible ? 'bg-gray-700' : ''
              }`}
            >
              Console
            </button>
            {onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Project'}
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
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
            }}
          />
          {error && (
            <div className="bg-red-50 text-red-500 p-2 text-sm border-t border-red-100">
              {error}
            </div>
          )}
        </div>
        
        <div className="w-1/2 flex flex-col">
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
                <div className="h-1/3 border-t border-gray-200">
                  <SandpackConsole resetOnPreviewReload={true} />
                </div>
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
        <p>Share your creation by copying the URL! 🚀</p>
      </footer>
    </div>
  );
}