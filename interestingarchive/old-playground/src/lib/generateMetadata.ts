/**
 * This file contains functions to automatically generate metadata
 * for React components pasted from AI tools like Claude or ChatGPT
 */

interface ComponentMetadata {
  title: string;
  description: string;
  tags: string[];
  aiTool?: string; // 'Claude' | 'ChatGPT' | 'Other'
}

/**
 * Analyzes React component code to generate meaningful metadata
 * This is a simple implementation that could be enhanced with actual AI services
 */
export function generateMetadata(code: string): ComponentMetadata {
  // Default metadata
  const metadata: ComponentMetadata = {
    title: "React Component",
    description: "A React component created with AI assistance",
    tags: ["React"],
    aiTool: undefined
  };

  // Extract component name
  const componentNameMatch = code.match(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/);
  if (componentNameMatch && componentNameMatch[1]) {
    metadata.title = formatComponentName(componentNameMatch[1]);
  }

  // Detect hooks
  if (code.includes('useState')) {
    metadata.tags.push('useState');
  }
  if (code.includes('useEffect')) {
    metadata.tags.push('useEffect');
  }
  if (code.includes('useContext')) {
    metadata.tags.push('Context API');
  }
  if (code.includes('useReducer')) {
    metadata.tags.push('useReducer');
  }

  // Detect UI elements/libraries
  if (code.includes('className=')) {
    if (code.includes('text-') || code.includes('bg-') || code.includes('p-')) {
      metadata.tags.push('Tailwind CSS');
    }
  }
  
  if (code.includes('flex') || code.includes('grid')) {
    metadata.tags.push('Flexbox/Grid');
  }

  // Detect component purpose
  if (code.includes('form') || code.includes('input') || code.includes('submit')) {
    metadata.description = "A form component with input fields";
    metadata.tags.push('Form');
  } else if (code.includes('button') && (code.includes('increment') || code.includes('count'))) {
    metadata.description = "A counter component with increment functionality";
    metadata.tags.push('Counter');
  } else if (code.includes('nav') || code.includes('menu') || code.includes('header')) {
    metadata.description = "A navigation component for website menus";
    metadata.tags.push('Navigation');
  } else if (code.includes('card') || code.includes('shadow') || code.includes('rounded')) {
    metadata.description = "A card component for displaying content";
    metadata.tags.push('Card');
  }

  // Detect AI tool signatures
  if (code.includes('Claude') || code.includes('Anthropic')) {
    metadata.aiTool = 'Claude';
  } else if (code.includes('ChatGPT') || code.includes('OpenAI')) {
    metadata.aiTool = 'ChatGPT';
  }

  return metadata;
}

/**
 * Formats component name into a readable title
 * Example: "TodoList" becomes "Todo List"
 */
function formatComponentName(name: string): string {
  // Add spaces between camelCase
  const withSpaces = name.replace(/([A-Z])/g, ' $1').trim();
  // Capitalize first letter and return
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}