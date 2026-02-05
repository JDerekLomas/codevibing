/**
 * Project data for the CodeVibing gallery
 */

export interface VibeProject {
  id: string;
  title: string;
  description: string;
  preview: {
    type: 'gif' | 'mp4' | 'image';
    src: string;
    poster?: string;
  };
  url?: string;
  repo?: string;
  tags: string[];
  tools: Array<{
    name: string;
    color: string;
  }>;
  creator: {
    name: string;
    url?: string;
  };
  createdAt: Date;
}

// Tool colors from design system
export const TOOL_COLORS = {
  'Claude Code': '#D97706',
  'Claude': '#D97706',
  'Cursor': '#8B5CF6',
  'v0': '#000000',
  'Copilot': '#238636',
  'ChatGPT': '#10A37F',
  'Gemini': '#4285F4',
  'AI Studio': '#4285F4',
} as const;

export const mockProjects: VibeProject[] = [
  {
    id: 'xwhysi',
    title: 'XWHYSI',
    description: 'Electronic music portfolio with AI-generated video backgrounds. Each track has unique visuals created with MuleRouter.',
    preview: {
      type: 'mp4',
      src: '/previews/xwhysi.mp4',
      poster: '/previews/xwhysi.png',
    },
    url: 'https://xwhysi.com',
    tags: ['music', 'video', 'Three.js', 'Next.js'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'source-library',
    title: 'Source Library',
    description: 'Historical text digitization platform with AI translation. Making 500 years of Latin texts accessible.',
    preview: {
      type: 'mp4',
      src: '/previews/sourcelibrary.mp4',
      poster: '/previews/sourcelibrary.png',
    },
    url: 'https://sourcelibrary.org',
    tags: ['OCR', 'translation', 'history', 'Latin'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
      { name: 'Gemini', color: TOOL_COLORS['Gemini'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'design-therapy',
    title: 'Design Therapy',
    description: 'Interactive design exploration tool. Process emotions through generative visual compositions.',
    preview: {
      type: 'mp4',
      src: '/previews/designtherapy.mp4',
      poster: '/previews/designtherapy.png',
    },
    url: 'https://designtherapy.vercel.app',
    tags: ['generative', 'art', 'wellness', 'interactive'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'futures-deck',
    title: 'Futures Deck',
    description: 'Speculative futures card deck for design thinking workshops. AI-generated scenarios and provocations.',
    preview: {
      type: 'mp4',
      src: '/previews/futures-deck.mp4',
      poster: '/previews/futures-deck.png',
    },
    url: 'https://futures-deck.vercel.app',
    tags: ['cards', 'futures', 'design', 'workshop'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 'da-vinci-trees',
    title: 'Da Vinci Trees',
    description: 'Interactive visualization of tree branching patterns based on Leonardo da Vinci\'s observations.',
    preview: {
      type: 'mp4',
      src: '/previews/da-vinci-trees.mp4',
      poster: '/previews/da-vinci-trees.png',
    },
    url: 'https://da-vinci-trees.vercel.app',
    tags: ['visualization', 'nature', 'Three.js', 'science'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'fractal-viewer',
    title: 'Fractal Viewer',
    description: 'Explore infinite mathematical patterns. Real-time fractal rendering with deep zoom capabilities.',
    preview: {
      type: 'mp4',
      src: '/previews/fractalviewer.mp4',
      poster: '/previews/fractalviewer.png',
    },
    url: 'https://fractalviewer-gamma.vercel.app',
    tags: ['math', 'visualization', 'WebGL', 'interactive'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-11-12'),
  },
  {
    id: 'babysees',
    title: 'Baby Sees',
    description: 'High-contrast visual stimulation for infant development. Science-backed patterns for newborn vision.',
    preview: {
      type: 'mp4',
      src: '/previews/babysees.mp4',
      poster: '/previews/babysees.png',
    },
    url: 'https://babysees.vercel.app',
    tags: ['babies', 'development', 'visual', 'parenting'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'funbookies',
    title: 'Funbookies',
    description: 'Children\'s reading app with decodable books and phonics assessments. 9 illustrated books progressing from CVC words to multi-syllable.',
    preview: {
      type: 'image',
      src: '/previews/funbookies.png',
    },
    url: 'https://funbookies.com',
    tags: ['education', 'phonics', 'children', 'reading'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-11-01'),
  },
  {
    id: 'alchemy-deck',
    title: 'Alchemy Deck',
    description: 'Oracle deck for contemplating transformation. 34 cards drawn from Western alchemical tradition with primary sources.',
    preview: {
      type: 'image',
      src: '/previews/alchemy-deck.png',
    },
    url: 'https://alchemy-deck.vercel.app',
    tags: ['cards', 'alchemy', 'philosophy', 'oracle'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-10-10'),
  },
  {
    id: 'second-renaissance',
    title: 'Second Renaissance',
    description: 'Latin Master Bibliography combining major catalogs (USTC, VD16-18, ESTC) into a comprehensive database of printed works 1450-1900.',
    preview: {
      type: 'image',
      src: '/previews/second-renaissance.png',
    },
    url: 'https://secondrenaissance.vercel.app',
    tags: ['Latin', 'bibliography', 'history', 'research'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-08-01'),
  },
  {
    id: 'playpowerlearn',
    title: 'PlayPowerLearn',
    description: 'Educational gaming platform with interactive learning experiences. Clean architecture rebuild with modern stack.',
    preview: {
      type: 'image',
      src: '/previews/playpowerlearn.png',
    },
    url: 'https://playpowerlearn-v2.vercel.app',
    tags: ['education', 'games', 'Next.js', 'learning'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'vibecodingevents',
    title: 'Vibe Community',
    description: 'Community platform for vibe coding events. Connect with other AI-assisted developers.',
    preview: {
      type: 'image',
      src: '/previews/vibecodingevents.png',
    },
    url: 'https://vibecommunity.vercel.app',
    tags: ['community', 'events', 'social', 'developers'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '3d-showcase',
    title: '3D Showcase',
    description: 'Three.js experiments and 3D web experiences. Interactive scenes and animations.',
    preview: {
      type: 'image',
      src: '/previews/3d.png',
    },
    url: 'https://3d-orpin-nu.vercel.app',
    tags: ['Three.js', '3D', 'WebGL', 'animation'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'minibooks',
    title: 'Minibooks',
    description: 'Compact illustrated storybooks for young readers. Bite-sized tales with engaging visuals.',
    preview: {
      type: 'image',
      src: '/previews/minibooks.png',
    },
    url: 'https://minibooks.vercel.app',
    tags: ['children', 'books', 'stories', 'education'],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('2025-01-05'),
  },
];
