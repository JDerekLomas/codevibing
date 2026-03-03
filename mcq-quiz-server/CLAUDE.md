# MCQ Quiz Server

MCP Apps server that presents interactive vibecoding quiz cards inline in Claude conversations.

## Architecture

- `server.ts` — MCP server with tools (`start-quiz`, `submit-answer`, `get-results`) and `ui://` resource
- `main.ts` — Entry point supporting stdio (Claude Desktop) and HTTP transports
- `src/mcp-app.tsx` — React app entry point (bundled by Vite into single HTML file)
- `src/components/` — QuizCard, AnswerOption, FeedbackPanel, ProgressBar, SessionSummary
- `src/quiz-data.ts` — 30 vibecoding MCQs across 3 topics
- `src/types.ts` — TypeScript interfaces

## Commands

- `npm run build` — Build client (Vite) then server (tsc)
- `npm run dev` — Run the HTTP server (port 3456)
- `npm run start:stdio` — Run in stdio mode for Claude Desktop

## How it works

1. LLM calls `start-quiz` → creates session, returns first question + opens UI
2. UI renders QuizCard, user clicks answer
3. UI calls `submit-answer` (app-only tool) → server returns feedback
4. After last question, UI calls `get-results` → shows SessionSummary
5. `updateModelContext()` pushes results back into conversation

## Dependencies

- `@modelcontextprotocol/ext-apps` — MCP Apps SDK (registerAppTool, useApp)
- `@modelcontextprotocol/sdk` — MCP SDK (McpServer, transports)
- `vite-plugin-singlefile` — Bundles React app into single HTML for ui:// resource
