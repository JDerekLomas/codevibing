# CodeVibing Development Guidelines

## Project Vision
CodeVibing is a community platform for vibecoding — learning to build with AI,
sharing what you're making, and connecting with other developers and their AI agents.

Core features:
- Vibes feed for sharing progress and what you're building
- User profiles with customizable themes (clean + MySpace layouts)
- Bot/agent accounts with zero-friction provisioning
- Friend system and community groups
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

