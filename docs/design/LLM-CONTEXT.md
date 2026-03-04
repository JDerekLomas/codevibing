# CodeVibing LLM Context

High-level architecture and design guidance for AI-assisted development.

---

## Project Overview

**CodeVibing** is a platform for sharing AI-generated projects. Think "Are.na meets Dribbble for vibe coding."

### Core Principles

1. **Platform-agnostic**: Works with any AI tool (Claude Code, Cursor, v0, Copilot, etc.)
2. **Anti-algorithmic**: No likes, no engagement metrics, no recommendation algorithms
3. **Dual attribution**: Credits both human creator and AI collaborator
4. **Process over polish**: Experiments and iterations welcome, not just finished products
5. **Minimalist UI**: Scandinavian design - content-first, generous whitespace

---

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with CSS variables for theming
- **Components**: Custom components (no UI library dependency)
- **Language**: TypeScript (strict mode)
- **Database**: TBD (likely Supabase or PlanetScale)
- **Auth**: TBD (likely NextAuth or Clerk)
- **Deployment**: Vercel

---

## Design DNA

### From Are.na
- 12-column grid with auto-fill responsive columns
- Minimal borders (1px, subtle colors)
- Typography: System fonts, clean hierarchy
- No engagement metrics (no likes, shares, view counts)
- Content-centric: interface disappears, content shines
- Manual curation over algorithmic discovery

### From Dribbble
- Visual-first cards with thumbnail previews
- Category/filter bar for discovery
- Author attribution on every card
- Clean hover states with subtle scale/shadow
- Professional polish without being corporate

### Unique to CodeVibing
- **AI tool badges**: Visual attribution for which AI was used
- **Code-as-content**: Projects include viewable/copyable code
- **Conversation history**: Optional "making of" showing prompts
- **Fork chains**: Track lineage when projects are remixed

---

## Page Structure

### Homepage (`/`)
- Hero: Brief intro + CTA to explore or share
- Featured section: Curated projects (manually selected, not algorithmic)
- Recent projects: Chronological feed of new additions
- Filter bar: By AI tool, tech stack, time period

### Gallery (`/explore`)
- Full-width grid of projects
- Persistent filter bar
- Infinite scroll or pagination
- No sorting by popularity (chronological or curated only)

### Project Detail (`/project/[id]`)
- Large preview image/iframe
- Title, description, tech stack
- Author info + AI tool used
- Code viewer with copy functionality
- Optional: Conversation/prompt history
- Fork button (creates copy in your gallery)

### User Profile (`/[username]`)
- Personal gallery of published projects
- Bio + links
- No follower counts or engagement metrics

### New Project (`/new`)
- Paste code textarea
- AI-powered metadata generation (title, description, tags)
- Screenshot upload or auto-generation
- Tool selector (which AI did you use?)
- Optional: Paste conversation/prompts

---

## Data Models

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  code: string;
  thumbnailUrl?: string;
  livePreviewUrl?: string;

  authorId: string;
  aiTool: 'claude-code' | 'cursor' | 'v0' | 'copilot' | 'bolt' | 'lovable' | 'other';
  techStack: string[]; // e.g., ['react', 'tailwind', 'typescript']

  conversationHistory?: string; // Optional markdown of prompts used
  forkedFromId?: string; // If this is a remix

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date; // null = draft
}

interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  links?: { label: string; url: string }[];
  createdAt: Date;
}
```

---

## Component Hierarchy

```
App
├── Navigation (sticky header)
│   ├── Logo
│   ├── SearchInput
│   └── UserMenu
├── Main Content
│   ├── Hero (homepage only)
│   ├── FilterBar
│   └── ProjectGrid
│       └── ProjectCard[]
│           ├── Thumbnail
│           ├── Title
│           ├── AuthorInfo
│           └── ToolBadge
└── Footer
```

---

## Key Patterns

### Responsive Grid
Always use auto-fill with minmax for project grids:
```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
```

### Card Hover States
Subtle, not flashy:
- Thumbnail: `scale(1.02)` with `duration-200`
- Border: darken slightly
- No dramatic shadows or color shifts

### Color Mode
Support light/dark with CSS variables. Default to system preference.

### Loading States
- Skeleton cards matching ProjectCard dimensions
- Animate with subtle opacity pulse (Are.na pattern)

### Empty States
Always provide helpful CTAs when content is missing.

---

## What NOT to Build

1. **Likes/hearts/stars** - No engagement metrics
2. **View counts** - Not displayed publicly
3. **Algorithmic feeds** - Chronological or curated only
4. **Comments** - Keep it simple (v1 at least)
5. **Notifications** - Minimal, if any
6. **Gamification** - No badges, streaks, or points

---

## File Organization

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── explore/page.tsx      # Gallery
│   ├── project/[id]/page.tsx # Project detail
│   ├── [username]/page.tsx   # User profile
│   ├── new/page.tsx          # Create project
│   └── layout.tsx            # Root layout
├── components/
│   ├── cards/
│   │   └── ProjectCard.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── project/
│   │   ├── CodePreview.tsx
│   │   └── FilterBar.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── Button.tsx
│       ├── ToolBadge.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── utils.ts              # clsx, formatters
│   └── constants.ts          # Tool configs, etc.
└── styles/
    └── globals.css           # CSS variables, base styles
```

---

## Development Priorities

### Phase 1: Personal Gallery
1. Project model and basic CRUD
2. ProjectCard and ProjectGrid components
3. User profile page
4. Code paste → metadata generation
5. Basic deploy to Vercel

### Phase 2: Public Discovery
1. Explore page with filters
2. Search functionality
3. User authentication
4. Project publishing flow

### Phase 3: Community Features
1. Forking/remixing
2. Conversation history display
3. Collections/channels
4. User settings

---

## References

- **Are.na**: https://are.na (anti-algorithmic curation)
- **Dribbble**: https://dribbble.com (visual discovery)
- **OpenProcessing**: https://openprocessing.org (creative code community)
- **v0 Community**: https://v0.dev/community (AI component showcase)
