# CodeVibing Component Library

Reference implementations for core UI components, synthesized from Are.na and Dribbble patterns.

---

## ProjectCard

The primary unit for displaying projects in galleries. Combines Are.na's clean borders with Dribbble's visual-first approach.

**Purpose**: Display a single project in a grid view with preview, title, and attribution.

**Variants**:
- `default` - Standard card with thumbnail
- `compact` - Smaller card for dense grids
- `featured` - Larger card with extended metadata

```tsx
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    createdAt: Date;
    author: {
      name: string;
      avatarUrl?: string;
    };
    aiTool: 'claude-code' | 'cursor' | 'v0' | 'copilot' | 'other';
    techStack?: string[];
  };
  variant?: 'default' | 'compact' | 'featured';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  return (
    <article className="group relative">
      {/* Thumbnail Container - 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CodeIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex w-full justify-between p-3">
            <span className="text-sm text-white">{project.techStack?.[0]}</span>
            <ToolBadge tool={project.aiTool} size="sm" />
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-1">
          <Link href={`/project/${project.id}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar src={project.author.avatarUrl} size="xs" />
          <span>{project.author.name}</span>
          <span>·</span>
          <time>{formatRelativeTime(project.createdAt)}</time>
        </div>
      </div>
    </article>
  );
}
```

---

## ToolBadge

Visual indicator for which AI tool was used to create a project.

**Purpose**: Quick visual attribution of the AI collaborator.

```tsx
const toolConfig = {
  'claude-code': {
    label: 'Claude Code',
    color: 'bg-claude text-white',
    icon: ClaudeIcon,
  },
  'cursor': {
    label: 'Cursor',
    color: 'bg-cursor text-white',
    icon: CursorIcon,
  },
  'v0': {
    label: 'v0',
    color: 'bg-v0 text-white',
    icon: VercelIcon,
  },
  'copilot': {
    label: 'Copilot',
    color: 'bg-copilot text-white',
    icon: GithubIcon,
  },
  'other': {
    label: 'AI',
    color: 'bg-gray-500 text-white',
    icon: SparklesIcon,
  },
};

interface ToolBadgeProps {
  tool: keyof typeof toolConfig;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ToolBadge({ tool, size = 'md', showLabel = true }: ToolBadgeProps) {
  const config = toolConfig[tool];
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-sm font-medium',
        config.color,
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {showLabel && config.label}
    </span>
  );
}
```

---

## ProjectGrid

Responsive grid layout following Are.na's auto-fill pattern.

**Purpose**: Display multiple projects in a responsive, flexible grid.

```tsx
interface ProjectGridProps {
  projects: Project[];
  columns?: 'auto' | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export function ProjectGrid({
  projects,
  columns = 'auto',
  gap = 'md'
}: ProjectGridProps) {
  return (
    <div
      className={clsx(
        'grid',
        // Column variants
        columns === 'auto' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        // Gap variants
        gap === 'sm' && 'gap-4',
        gap === 'md' && 'gap-6',
        gap === 'lg' && 'gap-8'
      )}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

---

## Navigation

Minimal fixed header following Are.na's 55px height pattern.

**Purpose**: Site-wide navigation with logo, search, and user menu.

```tsx
export function Navigation() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">CodeVibing</span>
        </Link>

        {/* Center: Search (desktop) */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <SearchInput className="w-full max-w-md" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <SearchIcon className="h-5 w-5" />
          </Button>

          <Link href="/new">
            <Button variant="default" size="sm">
              Share Project
            </Button>
          </Link>

          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
```

---

## FilterBar

Category and tool filtering, inspired by Dribbble's horizontal filter pattern.

**Purpose**: Allow users to filter projects by AI tool, tech stack, or time period.

```tsx
interface FilterBarProps {
  activeFilters: {
    tool?: string;
    stack?: string;
    period?: string;
  };
  onFilterChange: (filters: typeof activeFilters) => void;
}

export function FilterBar({ activeFilters, onFilterChange }: FilterBarProps) {
  const tools = ['all', 'claude-code', 'cursor', 'v0', 'copilot'];
  const periods = ['all-time', 'this-week', 'this-month'];

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
      {/* Tool Filter */}
      <div className="flex gap-1">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => onFilterChange({ ...activeFilters, tool })}
            className={clsx(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeFilters.tool === tool
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {tool === 'all' ? 'All Tools' : toolConfig[tool]?.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Period Filter */}
      <div className="flex gap-1">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => onFilterChange({ ...activeFilters, period })}
            className={clsx(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeFilters.period === period
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {period.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## EmptyState

For when there are no projects to display.

**Purpose**: Encouraging CTA when galleries are empty.

```tsx
interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <SparklesIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href} className="mt-4">
          <Button>{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
```

---

## CodePreview

Embedded preview for project code with syntax highlighting.

**Purpose**: Show code snippets without full-page navigation.

```tsx
interface CodePreviewProps {
  code: string;
  language?: string;
  maxHeight?: number;
  showLineNumbers?: boolean;
}

export function CodePreview({
  code,
  language = 'tsx',
  maxHeight = 400,
  showLineNumbers = true
}: CodePreviewProps) {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{ maxHeight }}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language.toUpperCase()}
        </span>
        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)}>
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>

      <pre className="overflow-auto p-4">
        <code className={`language-${language} text-sm`}>
          {/* Use your preferred syntax highlighter */}
          {code}
        </code>
      </pre>

      {/* Fade overlay if content is truncated */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
```

---

## Avatar

User avatar with fallback initials.

```tsx
interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground',
        sizeClasses[size]
      )}
    >
      {src ? (
        <Image src={src} alt={name || ''} fill className="object-cover" />
      ) : (
        initials || '?'
      )}
    </div>
  );
}
```

---

## Button

Standard button component with variants.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const variants = {
  default: 'bg-foreground text-background hover:bg-foreground/90',
  secondary: 'bg-muted text-foreground hover:bg-muted/80',
  ghost: 'hover:bg-muted hover:text-foreground',
  outline: 'border border-border hover:bg-muted',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10',
};

export function Button({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
```
