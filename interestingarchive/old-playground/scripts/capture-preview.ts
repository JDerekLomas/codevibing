#!/usr/bin/env npx ts-node

/**
 * Capture Preview - Automated project screenshot/GIF generator
 *
 * Usage:
 *   npx ts-node scripts/capture-preview.ts --url http://localhost:3000 --output preview.gif
 *   npx ts-node scripts/capture-preview.ts --url https://xwhysi.com --duration 8 --interactions click,wait,scroll
 */

import { chromium, Browser, Page } from 'playwright';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface CaptureOptions {
  url: string;
  output: string;
  duration: number; // seconds
  width: number;
  height: number;
  interactions?: string[]; // ['click:.button', 'wait:2000', 'scroll:500'] - run BEFORE recording
  duringRecord?: string[]; // interactions to run DURING recording (e.g., ['wait:3000', 'scroll:500'])
  waitForSelector?: string; // wait for this before starting
  skipInitial?: number; // skip first N seconds (loading screens)
}

const DEFAULT_OPTIONS: Partial<CaptureOptions> = {
  duration: 6,
  width: 1280,
  height: 800,
  skipInitial: 1,
};

/**
 * Execute a single interaction on a page
 */
async function executeInteraction(page: Page, interaction: string): Promise<void> {
  const [action, target] = interaction.split(':');
  console.log(`  🎯 ${action}: ${target || ''}`);

  switch (action) {
    case 'click':
      await page.click(target);
      break;
    case 'wait':
      await page.waitForTimeout(parseInt(target) || 1000);
      break;
    case 'scroll':
      await page.evaluate((y) => window.scrollBy(0, y), parseInt(target) || 300);
      break;
    case 'scrollTo':
      await page.evaluate((y) => window.scrollTo(0, y), parseInt(target) || 0);
      break;
    case 'smoothScroll':
      // Smooth scroll using mouse wheel for reliable animation
      const scrollAmount = parseInt(target) || 300;
      const steps = 20;
      const stepSize = scrollAmount / steps;
      for (let i = 0; i < steps; i++) {
        await page.mouse.wheel(0, stepSize);
        await page.waitForTimeout(50);
      }
      break;
    case 'hover':
      await page.hover(target);
      break;
    case 'type':
      const [selector, text] = target.split('|');
      await page.fill(selector, text);
      break;
    case 'key':
      await page.keyboard.press(target);
      break;
  }
}

/**
 * Execute a series of interactions
 */
async function executeInteractions(page: Page, interactions: string[], pauseBetween = 300): Promise<void> {
  for (const interaction of interactions) {
    await executeInteraction(page, interaction);
    if (pauseBetween > 0) {
      await page.waitForTimeout(pauseBetween);
    }
  }
}

async function capturePreview(options: CaptureOptions): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log(`🎬 Capturing ${opts.url}...`);

  // Ensure output directory exists
  const outputDir = path.dirname(opts.output);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser: Browser = await chromium.launch({
    headless: true,
  });

  // Create recording context
  const context = await browser.newContext({
    viewport: { width: opts.width!, height: opts.height! },
    recordVideo: {
      dir: '/tmp/claude/',
      size: { width: opts.width!, height: opts.height! },
    },
  });

  const page: Page = await context.newPage();

  try {
    // Navigate and wait for network idle
    await page.goto(opts.url, { waitUntil: 'networkidle' });

    // Wait for specific selector if provided
    if (opts.waitForSelector) {
      console.log(`⏳ Waiting for ${opts.waitForSelector}...`);
      await page.waitForSelector(opts.waitForSelector, { timeout: 30000 });
    }

    // Execute PRE-RECORD interactions (these get recorded but will be trimmed via skipInitial)
    if (opts.interactions && opts.interactions.length > 0) {
      console.log(`⏳ Running setup (will be trimmed from output)...`);
      await executeInteractions(page, opts.interactions, 0);
    }

    console.log(`🎥 Recording content...`);

    // Now run the duringRecord interactions (this is what we want to capture)
    if (opts.duringRecord && opts.duringRecord.length > 0) {
      await executeInteractions(page, opts.duringRecord, 0);
    }

    // Brief pause at the end
    await page.waitForTimeout(500);

  } finally {
    await context.close();
    await browser.close();
  }

  // Find the recorded video
  const videos = fs.readdirSync('/tmp/claude/').filter(f => f.endsWith('.webm'));
  const latestVideo = videos
    .map(f => ({ name: f, time: fs.statSync(`/tmp/claude/${f}`).mtime }))
    .sort((a, b) => b.time.getTime() - a.time.getTime())[0];

  if (!latestVideo) {
    throw new Error('No video file found');
  }

  const videoPath = `/tmp/claude/${latestVideo.name}`;
  console.log(`📹 Video saved: ${videoPath}`);

  // Convert to GIF using ffmpeg
  const isGif = opts.output.endsWith('.gif');
  const isMp4 = opts.output.endsWith('.mp4');

  // Duration limit for output (if specified and > skipInitial)
  const outputDuration = opts.duration && opts.duration > opts.skipInitial!
    ? `-t ${opts.duration - opts.skipInitial!}`
    : '';

  if (isGif) {
    console.log(`🔄 Converting to GIF...`);

    // Smaller, more compressed GIFs: 10fps, max 380px wide, lossy dithering
    const gifWidth = Math.min(opts.width!, 380);
    const gifFps = 10;

    // Two-pass for better quality: generate palette first
    const paletteCmd = `ffmpeg -y -ss ${opts.skipInitial} -i "${videoPath}" ${outputDuration} -vf "fps=${gifFps},scale=${gifWidth}:-1:flags=lanczos,palettegen=max_colors=128:stats_mode=diff" /tmp/claude/palette.png`;
    execSync(paletteCmd, { stdio: 'pipe' });

    // Then use palette to create GIF
    const gifCmd = `ffmpeg -y -ss ${opts.skipInitial} -i "${videoPath}" -i /tmp/claude/palette.png ${outputDuration} -lavfi "fps=${gifFps},scale=${gifWidth}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" "${opts.output}"`;
    execSync(gifCmd, { stdio: 'pipe' });

    // Cleanup
    fs.unlinkSync('/tmp/claude/palette.png');
  } else if (isMp4) {
    console.log(`🔄 Converting to MP4...`);
    const mp4Cmd = `ffmpeg -y -ss ${opts.skipInitial} -i "${videoPath}" ${outputDuration} -c:v libx264 -preset fast -crf 22 "${opts.output}"`;
    execSync(mp4Cmd, { stdio: 'pipe' });
  } else {
    // Just copy the webm
    fs.copyFileSync(videoPath, opts.output);
  }

  // Cleanup temp video
  fs.unlinkSync(videoPath);

  const stats = fs.statSync(opts.output);
  console.log(`✅ Saved: ${opts.output} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  return opts.output;
}

// Also export a function to capture a still frame
async function captureScreenshot(url: string, output: string, options?: {
  width?: number;
  height?: number;
  waitForSelector?: string;
  waitTime?: number;
}): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: {
      width: options?.width || 1280,
      height: options?.height || 800
    },
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  if (options?.waitForSelector) {
    await page.waitForSelector(options.waitForSelector);
  }

  if (options?.waitTime) {
    await page.waitForTimeout(options.waitTime);
  }

  await page.screenshot({ path: output, type: 'png' });
  await browser.close();

  console.log(`📸 Screenshot saved: ${output}`);
  return output;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const getArg = (name: string): string | undefined => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : undefined;
  };
  const hasFlag = (name: string): boolean => args.includes(`--${name}`);

  if (hasFlag('help') || args.length === 0) {
    console.log(`
Capture Preview - Generate GIFs/videos of web projects

Usage:
  npx ts-node scripts/capture-preview.ts --url <url> [options]

Options:
  --url <url>           URL to capture (required)
  --output <path>       Output file path (default: preview.gif)
  --duration <seconds>  Recording duration (default: 6)
  --width <pixels>      Viewport width (default: 1280)
  --height <pixels>     Viewport height (default: 800)
  --wait <selector>     Wait for this selector before recording
  --skip <seconds>      Skip first N seconds (default: 1)
  --interactions <list> Comma-separated interactions to run BEFORE recording:
                        click:<selector>, wait:<ms>, scroll:<px>,
                        hover:<selector>, type:<selector>|<text>, key:<key>
  --during <list>       Comma-separated interactions to run DURING recording:
                        Same syntax as --interactions, but these execute while
                        the video is being captured (for scroll animations, etc.)
  --screenshot          Take a still screenshot instead of video

Interaction commands:
  click:<selector>      Click an element
  wait:<ms>             Wait N milliseconds
  scroll:<px>           Scroll down by N pixels (instant)
  smoothScroll:<px>     Smooth scroll to Y position (animated)
  scrollTo:<px>         Scroll to absolute Y position
  hover:<selector>      Hover over element
  type:<sel>|<text>     Type text into input
  key:<key>             Press a key (ArrowRight, Enter, etc.)

Examples:
  # Simple GIF capture
  npx ts-node scripts/capture-preview.ts --url http://localhost:3000 --output preview.gif

  # Pre-record setup, then passive recording
  npx ts-node scripts/capture-preview.ts --url http://localhost:3000 \\
    --interactions "wait:2000,click:button.start" --duration 10

  # Capture scroll animation: wait 2s, then smooth scroll during recording
  npx ts-node scripts/capture-preview.ts --url https://example.com \\
    --during "wait:2000,smoothScroll:800,wait:3000" --duration 8

  # Screenshot only
  npx ts-node scripts/capture-preview.ts --url https://xwhysi.com --screenshot --output preview.png
`);
    return;
  }

  const url = getArg('url');
  if (!url) {
    console.error('❌ --url is required');
    process.exit(1);
  }

  const output = getArg('output') || 'preview.gif';

  if (hasFlag('screenshot')) {
    await captureScreenshot(url, output, {
      width: parseInt(getArg('width') || '1280'),
      height: parseInt(getArg('height') || '800'),
      waitForSelector: getArg('wait'),
      waitTime: parseInt(getArg('skip') || '1') * 1000,
    });
  } else {
    await capturePreview({
      url,
      output,
      duration: parseInt(getArg('duration') || '6'),
      width: parseInt(getArg('width') || '1280'),
      height: parseInt(getArg('height') || '800'),
      waitForSelector: getArg('wait'),
      skipInitial: parseInt(getArg('skip') || '1'),
      interactions: getArg('interactions')?.split(','),
      duringRecord: getArg('during')?.split(','),
    });
  }
}

main().catch(console.error);

export { capturePreview, captureScreenshot };
export type { CaptureOptions };
