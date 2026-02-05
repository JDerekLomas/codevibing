#!/usr/bin/env npx tsx

/**
 * Project Discovery - Find Claude Code projects and generate gallery entries
 *
 * Scans:
 * - ~/.claude/projects/ for session data and CLAUDE.md files
 * - Vercel deployments
 * - Local directories with CLAUDE.md
 *
 * Usage:
 *   npx tsx scripts/discover-projects.ts
 *   npx tsx scripts/discover-projects.ts --output projects.json
 *   npx tsx scripts/discover-projects.ts --vercel-only
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface DiscoveredProject {
  id: string;
  name: string;
  description: string;
  path: string;
  url?: string;
  vercelProject?: string;
  techStack: string[];
  lastModified: Date;
  hasClaudeMd: boolean;
  sessionCount: number;
}

const CLAUDE_PROJECTS_DIR = path.join(os.homedir(), '.claude', 'projects');

/**
 * Decode Claude project folder name to actual path
 */
function decodeProjectPath(folderName: string): string {
  // Format: -Users-dereklomas-projectname -> /Users/dereklomas/projectname
  return folderName.replace(/-/g, '/');
}

/**
 * Extract project name from path
 */
function extractProjectName(projectPath: string): string {
  const parts = projectPath.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'unknown';
}

/**
 * Read CLAUDE.md and extract description
 */
function readClaudeMd(projectPath: string): { description: string; techStack: string[] } | null {
  const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) return null;

  try {
    const content = fs.readFileSync(claudeMdPath, 'utf-8');

    // Extract first paragraph after title as description
    const lines = content.split('\n');
    let description = '';
    let inDescription = false;

    for (const line of lines) {
      if (line.startsWith('#') && !inDescription) {
        inDescription = true;
        continue;
      }
      if (inDescription && line.trim() && !line.startsWith('#')) {
        description = line.trim();
        break;
      }
    }

    // Detect tech stack from content
    const techStack: string[] = [];
    const techPatterns = [
      { pattern: /next\.?js/i, name: 'Next.js' },
      { pattern: /react/i, name: 'React' },
      { pattern: /three\.?js/i, name: 'Three.js' },
      { pattern: /typescript/i, name: 'TypeScript' },
      { pattern: /tailwind/i, name: 'Tailwind' },
      { pattern: /prisma/i, name: 'Prisma' },
      { pattern: /supabase/i, name: 'Supabase' },
      { pattern: /postgres/i, name: 'PostgreSQL' },
      { pattern: /elevenlabs/i, name: 'ElevenLabs' },
      { pattern: /openai/i, name: 'OpenAI' },
      { pattern: /gemini/i, name: 'Gemini' },
      { pattern: /playwright/i, name: 'Playwright' },
      { pattern: /d3\.?js/i, name: 'D3.js' },
    ];

    for (const { pattern, name } of techPatterns) {
      if (pattern.test(content) && !techStack.includes(name)) {
        techStack.push(name);
      }
    }

    return { description, techStack };
  } catch {
    return null;
  }
}

/**
 * Count session files for a project
 */
function countSessions(claudeProjectFolder: string): number {
  const fullPath = path.join(CLAUDE_PROJECTS_DIR, claudeProjectFolder);
  if (!fs.existsSync(fullPath)) return 0;

  try {
    const files = fs.readdirSync(fullPath);
    return files.filter(f => f.endsWith('.jsonl')).length;
  } catch {
    return 0;
  }
}

/**
 * Get Vercel projects
 */
function getVercelProjects(): Map<string, { name: string; url: string }> {
  const projects = new Map<string, { name: string; url: string }>();

  try {
    // Get lines with https URLs
    const output = execSync('vercel projects ls 2>&1 | grep https',
      { encoding: 'utf-8', timeout: 30000 });

    const lines = output.split('\n');
    for (const line of lines) {
      // Format: "  projectname          https://url.com                    1h        24.x"
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2 && parts[1].startsWith('https://')) {
        const projectName = parts[0];
        const url = parts[1];
        projects.set(projectName.toLowerCase(), { name: projectName, url });
        // Also map without -v2, -site suffixes for matching local folders
        const baseName = projectName.replace(/-v\d+$/, '').replace(/-site$/, '');
        if (baseName !== projectName) {
          projects.set(baseName.toLowerCase(), { name: projectName, url });
        }
      }
    }
  } catch (e) {
    // Grep returns exit code 1 if no matches, which is fine
  }

  return projects;
}

/**
 * Get Vercel domains
 */
function getVercelDomains(): Map<string, string> {
  const domains = new Map<string, string>();

  try {
    const output = execSync('vercel domains ls 2>/dev/null', { encoding: 'utf-8', timeout: 30000 });
    const lines = output.split('\n');

    for (const line of lines) {
      // Match domain names
      const match = line.match(/^\s*([a-z0-9.-]+\.[a-z]+)\s+/i);
      if (match && !match[1].includes('vercel')) {
        domains.set(match[1].split('.')[0].toLowerCase(), match[1]);
      }
    }
  } catch {
    console.error('Could not fetch Vercel domains');
  }

  return domains;
}

/**
 * Scan Claude projects directory
 */
function scanClaudeProjects(): DiscoveredProject[] {
  const projects: DiscoveredProject[] = [];
  const seen = new Set<string>();

  if (!fs.existsSync(CLAUDE_PROJECTS_DIR)) {
    console.error(`Claude projects directory not found: ${CLAUDE_PROJECTS_DIR}`);
    return projects;
  }

  const folders = fs.readdirSync(CLAUDE_PROJECTS_DIR);
  const vercelProjects = getVercelProjects();
  const vercelDomains = getVercelDomains();

  for (const folder of folders) {
    const projectPath = decodeProjectPath(folder);
    const projectName = extractProjectName(projectPath);

    // Skip duplicates and system folders
    if (seen.has(projectName.toLowerCase()) || projectName.startsWith('.')) continue;
    seen.add(projectName.toLowerCase());

    // Check if actual project directory exists
    if (!fs.existsSync(projectPath)) continue;

    // Read CLAUDE.md if present
    const claudeInfo = readClaudeMd(projectPath);
    const sessionCount = countSessions(folder);

    // Skip projects with very few sessions (likely just opened once)
    if (sessionCount < 2 && !claudeInfo) continue;

    // Try to find Vercel deployment
    const vercelProject = vercelProjects.get(projectName.toLowerCase());
    const customDomain = vercelDomains.get(projectName.toLowerCase());

    // Get last modified time
    let lastModified = new Date(0);
    try {
      const stat = fs.statSync(projectPath);
      lastModified = stat.mtime;
    } catch {}

    const project: DiscoveredProject = {
      id: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: projectName,
      description: claudeInfo?.description || '',
      path: projectPath,
      url: customDomain ? `https://${customDomain}` : vercelProject?.url,
      vercelProject: vercelProject?.name,
      techStack: claudeInfo?.techStack || [],
      lastModified,
      hasClaudeMd: !!claudeInfo,
      sessionCount,
    };

    projects.push(project);
  }

  // Sort by session count (most active first)
  projects.sort((a, b) => b.sessionCount - a.sessionCount);

  return projects;
}

/**
 * Generate gallery entry for mockProjects.ts
 */
function toGalleryEntry(project: DiscoveredProject): string {
  const tags = project.techStack.slice(0, 4);

  return `  {
    id: '${project.id}',
    title: '${project.name}',
    description: '${project.description.replace(/'/g, "\\'")}',
    preview: {
      type: 'image',
      src: '/previews/${project.id}.png',
    },
    ${project.url ? `url: '${project.url}',` : '// No URL - local only'}
    tags: [${tags.map(t => `'${t}'`).join(', ')}],
    tools: [
      { name: 'Claude Code', color: TOOL_COLORS['Claude Code'] },
    ],
    creator: { name: 'Derek Lomas' },
    createdAt: new Date('${project.lastModified.toISOString().split('T')[0]}'),
  }`;
}

async function main() {
  const args = process.argv.slice(2);
  const outputFile = args.find(a => a.startsWith('--output='))?.split('=')[1];
  const vercelOnly = args.includes('--vercel-only');
  const galleryFormat = args.includes('--gallery');

  console.log('🔍 Discovering Claude Code projects...\n');

  const projects = scanClaudeProjects();

  console.log(`Found ${projects.length} projects:\n`);

  // Display summary
  for (const p of projects) {
    const deployed = p.url ? `✓ ${p.url}` : '(local)';
    const sessions = `${p.sessionCount} sessions`;
    console.log(`  ${p.name.padEnd(25)} ${sessions.padEnd(15)} ${deployed}`);
  }

  // Filter to deployed only if requested
  const filtered = vercelOnly ? projects.filter(p => p.url) : projects;

  console.log(`\n📊 Summary:`);
  console.log(`  Total projects: ${projects.length}`);
  console.log(`  With CLAUDE.md: ${projects.filter(p => p.hasClaudeMd).length}`);
  console.log(`  Deployed (URL): ${projects.filter(p => p.url).length}`);
  console.log(`  Local only: ${projects.filter(p => !p.url).length}`);

  // Output formats
  if (galleryFormat) {
    console.log('\n📝 Gallery entries (copy to mockProjects.ts):\n');
    for (const p of filtered.filter(p => p.url)) {
      console.log(toGalleryEntry(p));
      console.log(',');
    }
  }

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(filtered, null, 2));
    console.log(`\n💾 Saved to ${outputFile}`);
  }

  // Show top candidates for gallery
  const candidates = filtered
    .filter(p => p.url && p.sessionCount >= 3)
    .slice(0, 10);

  if (candidates.length > 0) {
    console.log('\n⭐ Top candidates for gallery:');
    for (const p of candidates) {
      console.log(`  - ${p.name}: ${p.url}`);
    }
  }
}

main().catch(console.error);
