# CodeVibing Design System

Extracted from Are.na (minimalist, content-first) and Dribbble (visual discovery, engagement).

## Design Philosophy

**Are.na influence**: Anti-algorithmic, no engagement metrics, thoughtful curation, treats users as citizens not cattle. Content-centric with restrained chrome.

**Dribbble influence**: Visual-first grid, category filtering, clean card layouts, professional polish.

**CodeVibing synthesis**: Minimalist creative platform for vibe-coded projects. No likes/shares. Discovery through browsing and curation, not algorithms.

---

## Color Palette

### Core Colors (Light Mode)
| Name | Value | Usage |
|------|-------|-------|
| background | `#FFFFFF` | Page background |
| foreground | `#1A1A1A` | Primary text |
| muted | `#F5F5F5` | Card backgrounds, sections |
| muted-foreground | `#737373` | Secondary text, metadata |
| border | `#E5E5E5` | Card borders, dividers |
| accent | `#3D46C2` | Links, interactive elements |
| accent-hover | `#5E6DEE` | Hover state for accent |

### Core Colors (Dark Mode)
| Name | Value | Usage |
|------|-------|-------|
| background | `#0A0A0A` | Page background |
| foreground | `#FAFAFA` | Primary text |
| muted | `#171717` | Card backgrounds, sections |
| muted-foreground | `#A3A3A3` | Secondary text, metadata |
| border | `#262626` | Card borders, dividers |
| accent | `#5E6DEE` | Links, interactive elements |
| accent-hover | `#7C85F3` | Hover state for accent |

### Semantic Colors
| Name | Light | Dark | Usage |
|------|-------|------|-------|
| success | `#238020` | `#4ADE80` | Public/published status |
| warning | `#E15100` | `#FB923C` | Alerts, caution |
| error | `#B93D3D` | `#F87171` | Errors, private status |

### Tool Attribution Colors
| Tool | Color | Usage |
|------|-------|-------|
| Claude Code | `#D97706` | Claude attribution badges |
| Cursor | `#8B5CF6` | Cursor attribution |
| v0 | `#000000` | Vercel v0 attribution |
| Copilot | `#238636` | GitHub Copilot attribution |
| Generic AI | `#6B7280` | Unspecified AI tool |

---

## Typography

### Font Stack
```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, monospace;
```

### Type Scale
| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| display | 48px / 3rem | 700 | 1.1 | Hero headlines |
| h1 | 36px / 2.25rem | 600 | 1.2 | Page titles |
| h2 | 28px / 1.75rem | 600 | 1.25 | Section headers |
| h3 | 20px / 1.25rem | 600 | 1.3 | Card titles |
| body | 16px / 1rem | 400 | 1.5 | Body text |
| body-sm | 14px / 0.875rem | 400 | 1.5 | Secondary text |
| caption | 12px / 0.75rem | 400 | 1.4 | Metadata, timestamps |
| code | 14px / 0.875rem | 400 | 1.5 | Code snippets |

---

## Spacing System

Based on 4px base unit, following Are.na's incremental approach:

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight spacing, inline elements |
| space-2 | 8px | Icon gaps, small padding |
| space-3 | 12px | Card internal padding |
| space-4 | 16px | Standard gaps |
| space-5 | 20px | Section padding |
| space-6 | 24px | Card gaps in grid |
| space-8 | 32px | Section margins |
| space-10 | 40px | Large section gaps |
| space-12 | 48px | Page section spacing |
| space-16 | 64px | Major section breaks |

---

## Layout & Grid

### Container Widths
| Name | Max Width | Usage |
|------|-----------|-------|
| sm | 640px | Narrow content (forms, auth) |
| md | 768px | Blog posts, single project view |
| lg | 1024px | Standard pages |
| xl | 1280px | Wide galleries |
| full | 100% | Edge-to-edge (hero sections) |

### Project Grid
```css
/* Responsive auto-fill grid (Are.na pattern) */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6); /* 24px */
}

/* Mobile: single column at 520px */
@media (max-width: 520px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4); /* 16px */
  }
}
```

### Breakpoints
| Name | Min Width | Columns |
|------|-----------|---------|
| mobile | 0 | 1 |
| tablet | 640px | 2 |
| desktop | 1024px | 3-4 (auto-fill) |
| wide | 1280px | 4-5 (auto-fill) |

---

## Border & Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 3px | Small elements, badges |
| radius-md | 6px | Cards, buttons |
| radius-lg | 12px | Modal dialogs, large cards |
| radius-full | 9999px | Avatars, pills |

| Token | Value | Usage |
|-------|-------|-------|
| border-thin | 1px solid var(--border) | Card borders |
| border-focus | 2px solid var(--accent) | Focus states |

---

## Shadows & Effects

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| shadow-md | `0 4px 6px rgba(0,0,0,0.07)` | Cards on hover |
| shadow-lg | `0 10px 25px rgba(0,0,0,0.1)` | Modals, dropdowns |

### Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

---

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          hover: 'hsl(var(--accent-hover))',
        },
        border: 'hsl(var(--border))',
        // Tool colors
        claude: '#D97706',
        cursor: '#8B5CF6',
        v0: '#000000',
        copilot: '#238636',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        sm: '3px',
        md: '6px',
        lg: '12px',
      },
    },
  },
}
```

---

## CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 10%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --border: 0 0% 90%;
    --accent: 234 55% 50%;
    --accent-hover: 234 70% 65%;

    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'SF Mono', ui-monospace, Menlo, Monaco, Consolas, monospace;
  }

  .dark {
    --background: 0 0% 4%;
    --foreground: 0 0% 98%;
    --muted: 0 0% 9%;
    --muted-foreground: 0 0% 64%;
    --border: 0 0% 15%;
    --accent: 234 70% 65%;
    --accent-hover: 234 75% 72%;
  }
}
```
