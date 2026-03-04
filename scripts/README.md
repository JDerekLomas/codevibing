# Preview Capture Scripts

Automated tools for capturing GIFs and screenshots of projects using Playwright.

## Setup

```bash
cd /Users/dereklomas/CodeVibing/codevibing
npm install
npx playwright install chromium
```

## Quick Usage

### Capture a single URL
```bash
# GIF (default 6 seconds)
npm run capture -- --url http://localhost:3000 --output public/previews/my-project.gif

# Screenshot
npm run capture -- --url http://localhost:3000 --screenshot --output public/previews/my-project.png

# Longer recording with skip
npm run capture -- --url https://xwhysi.com --duration 10 --skip 2 --output xwhysi.gif
```

### Capture with interactions
```bash
# Click a button, wait, scroll
npm run capture -- --url http://localhost:3000 \
  --interactions "wait:2000,click:button.start,wait:1000,scroll:500" \
  --duration 10 \
  --output demo.gif
```

### Batch capture all configured projects
```bash
# List configured projects
npm run capture:list

# Capture all
npm run capture:all

# Capture one specific project
npm run capture:all -- santa-express
```

## Interaction Commands

| Command | Example | Description |
|---------|---------|-------------|
| `click` | `click:.btn` | Click an element |
| `wait` | `wait:2000` | Wait N milliseconds |
| `scroll` | `scroll:500` | Scroll down N pixels |
| `hover` | `hover:.card` | Hover over element |
| `type` | `type:#input\|hello` | Type text into input |
| `key` | `key:ArrowRight` | Press a key |

## Tips for "Money Shot" Captures

1. **Skip loading screens**: Use `--skip 2` to trim the first 2 seconds
2. **Wait for content**: Use `--wait ".main-content"` to wait for selector
3. **Stage interactions**: Use interactions to navigate to the interesting part
4. **Right duration**: 6-10 seconds is usually enough

## Output Specs

| Format | Default Size | Notes |
|--------|--------------|-------|
| GIF | 800px wide, 12fps | Optimized with palette |
| PNG | 1280x800 | Full viewport |
| MP4 | 1280x800 | H.264, good quality |

## Adding New Projects

Edit `scripts/capture-gallery.ts` and add to the `PROJECTS` array:

```typescript
{
  id: 'my-project',
  name: 'My Cool Project',
  url: 'http://localhost:3000',
  type: 'gif', // or 'screenshot' or 'both'
  duration: 8,
  interactions: ['wait:2000', 'click:.demo-button'],
  notes: 'Show the animation after clicking the button',
}
```

## Requirements

- Node.js 18+
- ffmpeg (for GIF conversion)
- Playwright Chromium browser

Install ffmpeg on Mac:
```bash
brew install ffmpeg
```
