# CodeVibing Development Guidelines

## Project Vision
CodeVibing is an AI community of practice that welcomes you to learn, share, and build together.

Two kinds of learning, both real:
- **Formal learning** — guides, tutorials, structured paths. Gets someone from zero to their first build.
- **Community learning** — the feed, build logs, Q&A, watching how others work. Keeps people going after that.

Priority stack:
1. **Learn** — structured content AND learning through participation. Both matter.
2. **Community** — a place to belong, find your people, get help and encouragement
3. **Share** — show what you're building, celebrate the process not just the product
4. **Agents** — bots and AI agents participate too (infrastructure, not the pitch)

Core features:
- Structured learning paths for beginners (guides, tutorials, "start here")
- Community feed for build logs, questions, wins, work-in-progress
- User profiles with customizable themes (clean + MySpace layouts)
- Groups around interests (education, games, tools, etc.)
- Friend system and community norms that reward helping
- Bot/agent accounts with zero-friction provisioning
- Onboarding via Claude Code skill

## Current Phase: Early User Testing (March 2026)

We're inviting real people to use the site and collecting feedback to understand what makes a good community. Every session should keep this in mind:

- **User-reported issues are high priority.** If someone says something is broken or confusing, fix it before building new features.
- **UX friction matters more than features right now.** Can someone join, post, navigate, and understand what this place is? That's the bar.
- **Feedback lives at /c/feedback.** Users can post bug reports, feature ideas, and friction reports there. Check it periodically.
- **When building, think "would a new user understand this?"** We're optimizing for newcomer experience, not power users.
- **The auto-scheduling system for posts (`getNextPublishSlot`) is for bot content only.** User-submitted posts via the API always publish immediately (`publish_at: now`). Don't reintroduce scheduling for user posts.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint -- --fix` - Run ESLint with auto-fix
- `npm run format` - Format with Prettier
- `npm test -- -t "test name"` - Run specific test

## Code Style
- TypeScript for type safety with strict mode
- React functional components with hooks
- Use explicit return types for exported functions
- Import order: React/Next.js, external libraries, internal modules (@/*)
- 2 spaces indentation
- Use async/await for asynchronous code (avoid raw promises)
- Use descriptive variable names (camelCase for variables, PascalCase for components)
- Components follow the naming convention [Name].tsx
- Try/catch blocks for error handling with appropriate feedback to users
- Interface over type for object definitions, especially in props
- Tailwind for styling with clsx for conditional classes

## Project Structure
- `src/app` - Next.js app router pages
- `src/components` - Reusable React components
- `src/lib` - Utilities and shared code
- `src/data` - Data models and initial seed data

## Component Publishing Flow
1. User pastes AI-generated React code into playground
2. System auto-generates metadata (title, description, tags)
3. User can edit metadata and upload/generate screenshots
4. Project is published to gallery with proper attribution
5. Community can view, like, and fork components
