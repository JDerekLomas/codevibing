# CodeVibing Gallery & Capture Script Handoff

**Date:** 2026-02-05
**Project:** /Users/dereklomas/CodeVibing/codevibing

## Summary

Added 8 new projects to the gallery and significantly improved the capture script to support timed interactions during recording.

## What Was Done

### 1. Added Projects to Gallery (`src/data/mockProjects.ts`)

New projects added:
- Funbookies (funbookies.com)
- SimGov (local)
- PlasmaCell 3D (local)
- Alchemy Deck (alchemy-deck.vercel.app)
- Second Renaissance (secondrenaissance.vercel.app)
- STEAMQuests (AWS)
- Santa's Pikachu Express (local)

**Total gallery projects: 16**

### 2. Capture Script Improvements (`scripts/capture-preview.ts`)

**New features:**
- `duringRecord` option - interactions that run DURING recording (for scroll animations)
- `smoothScroll` command - uses mouse wheel for reliable animated scrolling
- Proper wait-then-capture flow: wait for content → skip that time in output → capture the good stuff

**Key parameters for sourcelibrary.org:**
```bash
npm run capture -- \
  --url https://sourcelibrary.org \
  --interactions "wait:18000" \
  --during "wait:300,smoothScroll:400,wait:1500" \
  --skip 20 \
  --duration 26 \
  --output public/previews/sourcelibrary-scroll-final.gif
```

**GIF settings (in script):**
- Width: 380px max
- FPS: 10
- Colors: 128
- Result: ~2.6MB for 6 seconds

### 3. Capture Config Updated (`scripts/capture-gallery.ts`)

Added `duringRecord` support to ProjectCapture interface and batch capture function.

## Files Modified

- `src/data/mockProjects.ts` - Added 8 new projects
- `scripts/capture-preview.ts` - Added duringRecord, smoothScroll, fixed ffmpeg duration
- `scripts/capture-gallery.ts` - Added duringRecord to interface and capture function

## Next Steps

1. **Capture previews** for all new projects (need to run local servers for some)
2. **Deploy gallery** - the /vibes page shows the portfolio
3. **Add oura project** - user mentioned this, need deployed URL
4. **Create slide deck** - gather all project content for presentation

## How to Capture New Projects

```bash
cd /Users/dereklomas/CodeVibing/codevibing

# List configured projects
npm run capture:list

# Capture single project
npm run capture -- --url https://example.com \
  --interactions "wait:15000" \
  --during "wait:500,smoothScroll:400,wait:1000" \
  --skip 17 \
  --duration 22 \
  --output public/previews/project-name.gif

# Batch capture all
npm run capture:all
```

## Key Insight

The tricky part was understanding that Playwright's `recordVideo` starts immediately when context is created. Solution: record everything including the wait, then use ffmpeg `-ss` to skip the loading/waiting portion from the final output.
