export interface Skill {
  slug: string;
  name: string;
  description: string;
  installCommand: string | null;
  author: string;
  authorUrl: string;
  tags: string[];
}

export const skills: Skill[] = [
  {
    slug: 'codevibing',
    name: 'codevibing',
    description: 'Share to codevibing.com — the social network for Claude Code users. Zero friction posting, heartbeats, friends.',
    installCommand: 'claude skill add JDerekLomas/codevibing-skill',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['social', 'community'],
  },
  {
    slug: 'd3-visualization',
    name: 'd3-visualization',
    description: 'Create interactive data visualizations using D3.js. Custom charts, network diagrams, geographic maps, and complex SVG-based visuals.',
    installCommand: 'claude skill add --url https://raw.githubusercontent.com/JDerekLomas/claude-code-skills/main/skills/d3-visualization/SKILL.md',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['visualization', 'data', 'd3'],
  },
  {
    slug: 'site-design-replication',
    name: 'site-design-replication',
    description: 'Replicate a live website as a Next.js app. Crawl structure, extract design system, scaffold project, create all pages with real content.',
    installCommand: 'claude skill add --url https://raw.githubusercontent.com/JDerekLomas/claude-code-skills/main/skills/site-design-replication/SKILL.md',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['design', 'web', 'next.js'],
  },
  {
    slug: 'card-deck-creation',
    name: 'card-deck-creation',
    description: 'Create themed card decks with AI-generated artwork, Puppeteer rendering, and web deployment.',
    installCommand: 'claude skill add --url https://raw.githubusercontent.com/JDerekLomas/claude-code-skills/main/skills/card-deck-creation/SKILL.md',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['creative', 'cards', 'ai-art'],
  },
  {
    slug: 'mulerouter',
    name: 'mulerouter',
    description: 'Generate images and videos using MuleRouter multimodal APIs. Text-to-image, image-to-image, text-to-video, and more.',
    installCommand: 'claude skill add --url https://raw.githubusercontent.com/JDerekLomas/claude-code-skills/main/skills/mulerouter-skills/SKILL.md',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['ai', 'images', 'video', 'generative'],
  },
  {
    slug: 'frontend-design',
    name: 'frontend-design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality. Avoids generic AI aesthetics.',
    installCommand: 'claude skill add --url https://raw.githubusercontent.com/JDerekLomas/claude-code-skills/main/skills/frontend-design/SKILL.md',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['design', 'frontend', 'ui'],
  },
  {
    slug: 'input',
    name: 'input',
    description: 'Human-in-the-loop feedback tools for reviewing AI output. Review sites, get design feedback, check generated images.',
    installCommand: 'claude skill add --url https://raw.githubusercontent.com/JDerekLomas/claude-code-skills/main/skills/input/SKILL.md',
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['feedback', 'review', 'hitl'],
  },
  {
    slug: 'session-replay',
    name: 'session-replay',
    description: 'Create animated canvas-based videos that replay a Claude Code building session with real prompts and AI responses.',
    installCommand: null,
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['video', 'replay', 'creative'],
  },
  {
    slug: 'html-to-svg',
    name: 'html-to-svg',
    description: 'Convert rendered HTML/CSS to outlined SVG vectors. Renders with Puppeteer, traces with potrace for clean vector paths.',
    installCommand: null,
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['svg', 'design', 'conversion'],
  },
  {
    slug: 'visual-compare',
    name: 'visual-compare',
    description: 'Visual comparison of a reference app against a replica. Screenshots both via Chrome DevTools, uses Claude vision to identify differences.',
    installCommand: null,
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['testing', 'visual', 'qa'],
  },
  {
    slug: 'literature-review',
    name: 'literature-review',
    description: 'Conduct comprehensive, systematic literature reviews across academic databases. PubMed, arXiv, Semantic Scholar, and more.',
    installCommand: null,
    author: 'JDerekLomas',
    authorUrl: 'https://github.com/JDerekLomas',
    tags: ['research', 'academic', 'writing'],
  },
];
