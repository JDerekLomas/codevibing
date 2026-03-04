#!/usr/bin/env node

/**
 * Capture script - Playwright video → ffmpeg → GIF/MP4/PNG
 *
 * Usage:
 *   node scripts/capture.mjs https://xwhysi.com xwhysi.gif
 *   node scripts/capture.mjs https://xwhysi.com xwhysi.mp4 --scroll
 *   node scripts/capture.mjs https://xwhysi.com xwhysi.png --skip 10
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function capture(url, outputPath, options = {}) {
  const skip = options.skip ?? 8;  // Default 8s to let page fully load
  const scroll = options.scroll ?? true;  // Default: scroll after initial capture
  const staticTime = options.staticTime ?? 1;  // 1s static at top
  const scrollTime = options.scrollTime ?? 3;  // 3s smooth scroll
  const width = options.width || 1280;
  const height = options.height || 800;

  const duration = skip + staticTime + scrollTime;

  const tempDir = '/tmp/claude';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  console.log(`🎬 Capturing ${url}...`);
  console.log(`   Load wait: ${skip}s, Static: ${staticTime}s, Scroll: ${scroll ? scrollTime + 's' : 'off'}`);

  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: {
      dir: tempDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (err) {
    console.log(`⚠️  Navigation warning: ${err.message}`);
  }

  // Wait for page to fully render (WebGL, animations, etc.)
  console.log(`⏱️  Waiting ${skip}s for page to load...`);
  await page.waitForTimeout(skip * 1000);

  // Static capture at top
  console.log(`📷 Recording ${staticTime}s static...`);
  await page.waitForTimeout(staticTime * 1000);

  // Smooth scroll to bottom
  if (scroll) {
    console.log(`📜 Scrolling for ${scrollTime}s...`);
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = height;
    const scrollDistance = scrollHeight - viewportHeight;

    if (scrollDistance > 0) {
      const steps = 60 * scrollTime; // 60fps
      const stepDelay = (scrollTime * 1000) / steps;
      const stepDistance = scrollDistance / steps;

      for (let i = 0; i < steps; i++) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), stepDistance * (i + 1));
        await page.waitForTimeout(stepDelay);
      }
    } else {
      // Page fits in viewport, just wait
      await page.waitForTimeout(scrollTime * 1000);
    }
  }

  await context.close();
  await browser.close();

  // Find the video file
  const videos = fs.readdirSync(tempDir).filter(f => f.endsWith('.webm'));
  const latest = videos
    .map(f => ({ name: f, time: fs.statSync(path.join(tempDir, f)).mtime }))
    .sort((a, b) => b.time - a.time)[0];

  if (!latest) {
    throw new Error('No video recorded');
  }

  const videoPath = path.join(tempDir, latest.name);
  console.log(`📹 Video: ${videoPath}`);

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (outDir && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Convert output
  const isGif = outputPath.endsWith('.gif');
  const outputDuration = staticTime + (scroll ? scrollTime : 0);

  if (isGif) {
    console.log(`🔄 Converting to GIF...`);

    // Generate palette for better colors
    const palettePath = path.join(tempDir, 'palette.png');
    execSync(`ffmpeg -y -ss ${skip} -t ${outputDuration} -i "${videoPath}" -vf "fps=12,scale=800:-1:flags=lanczos,palettegen=stats_mode=diff" "${palettePath}"`, { stdio: 'pipe' });

    // Create GIF with palette
    execSync(`ffmpeg -y -ss ${skip} -t ${outputDuration} -i "${videoPath}" -i "${palettePath}" -lavfi "fps=12,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" "${outputPath}"`, { stdio: 'pipe' });

    fs.unlinkSync(palettePath);
  } else if (outputPath.endsWith('.mp4')) {
    execSync(`ffmpeg -y -ss ${skip} -t ${outputDuration} -i "${videoPath}" -c:v libx264 -preset fast -crf 22 "${outputPath}"`, { stdio: 'pipe' });
  } else if (outputPath.endsWith('.png')) {
    // Screenshot - take frame after skip (at the static moment)
    execSync(`ffmpeg -y -ss ${skip} -i "${videoPath}" -frames:v 1 "${outputPath}"`, { stdio: 'pipe' });
  } else {
    fs.copyFileSync(videoPath, outputPath);
  }

  fs.unlinkSync(videoPath);

  const stats = fs.statSync(outputPath);
  console.log(`✅ Saved: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  return outputPath;
}

// CLI
const args = process.argv.slice(2);

if (args.length < 2 || args.includes('--help')) {
  console.log(`
Usage: node scripts/capture.mjs <url> <output> [options]

Options:
  --skip <s>       Wait time before capture (default: 8, for WebGL/animations)
  --no-scroll      Disable smooth scroll (just static capture)
  --static <s>     Static time at top (default: 1)
  --scroll-time <s> Scroll duration (default: 3)
  --width <px>     Viewport width (default: 1280)
  --height <px>    Viewport height (default: 800)

Examples:
  node scripts/capture.mjs https://example.com preview.mp4
  node scripts/capture.mjs https://example.com preview.gif --skip 10
  node scripts/capture.mjs https://example.com preview.png --no-scroll
`);
  process.exit(0);
}

const url = args[0];
const output = args[1];

const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? parseInt(args[idx + 1]) : undefined;
};

const hasFlag = (name) => args.includes(`--${name}`);

capture(url, output, {
  skip: getArg('skip'),
  scroll: !hasFlag('no-scroll'),
  staticTime: getArg('static'),
  scrollTime: getArg('scroll-time'),
  width: getArg('width'),
  height: getArg('height'),
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
