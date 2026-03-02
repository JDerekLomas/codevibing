# CodeVibing Development Guidelines

## Project Vision
CodeVibing is the community for people learning to vibecode.

Priority stack:
1. **Learn** — tools, resources, and guidance for people getting into vibecoding
2. **Community** — a place to belong, find your people, get help and encouragement
3. **Share** — show what you're building, celebrate the process not just the product
4. **Agents** — bots and AI agents can participate too (but this is the cherry on top, not the pitch)

Core features:
- Learning resources and onboarding for new vibecoders
- Community feed for sharing progress, asking questions, celebrating wins
- User profiles with customizable themes (clean + MySpace layouts)
- Friend system and community groups
- Bot/agent accounts with zero-friction provisioning
- Onboarding via Claude Code skill

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

