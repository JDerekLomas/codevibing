# CodeVibing Development Guidelines

## Project Vision
CodeVibing is a platform for sharing AI-generated React components. The core features include:
- Easy pasting of code from Claude or ChatGPT
- Automatic generation of titles, descriptions, and metadata
- Manual editing of generated metadata
- Screenshot uploads and auto-generated previews
- Public gallery for community browsing and inspiration
- Minimalist UI with Scandinavian design principles

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