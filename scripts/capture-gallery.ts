#!/usr/bin/env npx ts-node

/**
 * Batch capture previews for all gallery projects
 *
 * Usage:
 *   npx ts-node scripts/capture-gallery.ts
 *   npx ts-node scripts/capture-gallery.ts --project santa-express
 */

import { capturePreview, captureScreenshot, CaptureOptions } from './capture-preview';
import * as fs from 'fs';
import * as path from 'path';

interface ProjectCapture {
  id: string;
  name: string;
  url: string; // localhost or live URL
  type: 'gif' | 'screenshot' | 'both';
  duration?: number;
  interactions?: string[]; // Run BEFORE recording starts
  duringRecord?: string[]; // Run DURING recording (for scroll animations, etc.)
  waitForSelector?: string;
  skipInitial?: number;
  notes?: string; // What makes this the "money shot"
}

// Configure your projects here
const PROJECTS: ProjectCapture[] = [
  // Tier 1: Flagship
  {
    id: 'source-library',
    name: 'Source Library',
    url: 'https://sourcelibrary.org',
    type: 'both',
    duration: 10,
    notes: 'Show the side-by-side Latin/English translation view with scroll',
    interactions: ['wait:1000', 'click:a[href*="/book"]', 'wait:2000'],
    duringRecord: ['wait:3000', 'smoothScroll:400', 'wait:2000', 'smoothScroll:800'],
  },
  {
    id: 'second-renaissance',
    name: 'Second Renaissance',
    url: 'https://secondrenaissance.vercel.app',
    type: 'both',
    duration: 8,
    notes: 'Show the catalog browser or translation dashboard',
  },
  {
    id: 'xwhysi',
    name: 'XWHYSI',
    url: 'https://xwhysi.com',
    type: 'gif',
    duration: 10,
    skipInitial: 2,
    notes: 'Capture the psychedelic video backgrounds cycling',
  },

  // Tier 2: 3D Interactive
  {
    id: 'santa-express',
    name: "Santa's Pikachu Express",
    url: 'http://localhost:5173', // Run: cd ~/3d && npm run dev
    type: 'gif',
    duration: 10,
    skipInitial: 3, // Skip loading screen
    interactions: ['wait:3000'], // Let it auto-rotate
    notes: 'Train circling, presents falling, T-Rex visible',
  },
  {
    id: 'plasmacell',
    name: 'PlasmaCell 3D',
    url: 'http://localhost:5173', // Run: cd ~/plasmacell && npm run dev
    type: 'gif',
    duration: 8,
    notes: 'Zoom into organelles, show labels',
  },
  {
    id: 'fractal-breeder',
    name: 'Fractal Breeder',
    url: 'https://fractalviewer-dereklomas-projects.vercel.app',
    type: 'gif',
    duration: 10,
    interactions: ['wait:2000', 'click:.fractal-card:nth-child(1)', 'click:.fractal-card:nth-child(3)', 'wait:1000'],
    notes: 'Show selecting fractals and breeding new generation',
  },
  {
    id: 'simgov',
    name: 'SimGov 3D City',
    url: 'http://localhost:3000', // Run: cd ~/simgov && npm run dev
    type: 'gif',
    duration: 8,
    notes: 'Cars moving, camera orbiting buildings',
  },

  // Tier 3: Cards
  {
    id: 'futures-deck',
    name: 'Futures Deck',
    url: 'file:///Users/dereklomas/CardDecks/futures-deck/web/index.html',
    type: 'screenshot',
    notes: 'Grid of cards showing variety',
  },
  {
    id: 'alchemy-deck',
    name: 'Alchemy Deck',
    url: 'file:///Users/dereklomas/CardDecks/alchemy-deck/web/index.html',
    type: 'screenshot',
    notes: 'Grid showing alchemical symbols',
  },

  // Tier 4: Kids/Educational
  {
    id: 'babysees',
    name: 'BabySees',
    url: 'https://babysees.vercel.app',
    type: 'gif',
    duration: 6,
    interactions: ['wait:1000', 'key:ArrowRight', 'wait:1500', 'key:ArrowRight', 'wait:1500'],
    notes: 'Flip through a few pages showing fractals/nebulae',
  },
  {
    id: 'funbookies',
    name: 'Funbookies',
    url: 'https://funbookies.com',
    type: 'both',
    duration: 10,
    skipInitial: 2,
    notes: 'Show book covers, then scroll through them',
    duringRecord: ['wait:2000', 'smoothScroll:300', 'wait:2000', 'smoothScroll:600'],
  },
  {
    id: 'steamquests',
    name: 'STEAMQuests',
    url: 'https://d3gx5tnc7g0w99.cloudfront.net', // Update with actual URL
    type: 'both',
    duration: 8,
    notes: 'Show quest selection or interactive element',
  },

  // Tier 5: Local dev projects (run locally first)
  {
    id: 'simgov',
    name: 'SimGov',
    url: 'http://localhost:3000', // Run: cd ~/simgov && npm run dev
    type: 'gif',
    duration: 10,
    skipInitial: 2,
    notes: 'Camera orbiting, cars moving, buildings visible',
  },
  {
    id: 'plasmacell',
    name: 'PlasmaCell 3D',
    url: 'http://localhost:5173', // Run: cd ~/plasmacell && npm run dev
    type: 'gif',
    duration: 8,
    notes: 'Zoom into organelles, show labels',
  },
  {
    id: 'alchemy-deck',
    name: 'Alchemy Deck',
    url: 'https://alchemy-deck.vercel.app',
    type: 'both',
    duration: 6,
    notes: 'Grid of alchemical symbol cards',
  },
  {
    id: 'second-renaissance',
    name: 'Second Renaissance',
    url: 'https://secondrenaissance.vercel.app',
    type: 'both',
    duration: 6,
    notes: 'Bibliography browser or search interface',
  },
];

const OUTPUT_DIR = path.join(__dirname, '../public/previews');

async function captureProject(project: ProjectCapture): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${project.name} (${project.id})`);
  if (project.notes) console.log(`💡 ${project.notes}`);
  console.log(`${'='.repeat(60)}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    if (project.type === 'screenshot' || project.type === 'both') {
      await captureScreenshot(project.url, path.join(OUTPUT_DIR, `${project.id}.png`), {
        waitForSelector: project.waitForSelector,
        waitTime: (project.skipInitial || 1) * 1000,
      });
    }

    if (project.type === 'gif' || project.type === 'both') {
      await capturePreview({
        url: project.url,
        output: path.join(OUTPUT_DIR, `${project.id}.gif`),
        duration: project.duration || 6,
        width: 1280,
        height: 800,
        interactions: project.interactions,
        duringRecord: project.duringRecord,
        waitForSelector: project.waitForSelector,
        skipInitial: project.skipInitial || 1,
      });
    }
  } catch (error) {
    console.error(`❌ Failed to capture ${project.name}:`, error);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const projectId = args.find(a => !a.startsWith('--'));

  if (args.includes('--list')) {
    console.log('\nConfigured projects:');
    PROJECTS.forEach(p => {
      console.log(`  ${p.id.padEnd(20)} ${p.name.padEnd(25)} ${p.url}`);
    });
    return;
  }

  if (projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) {
      console.error(`❌ Project not found: ${projectId}`);
      console.log('Available:', PROJECTS.map(p => p.id).join(', '));
      process.exit(1);
    }
    await captureProject(project);
  } else {
    console.log(`\n🎬 Capturing ${PROJECTS.length} projects...\n`);
    for (const project of PROJECTS) {
      await captureProject(project);
    }
  }

  console.log(`\n✅ Done! Previews saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);
