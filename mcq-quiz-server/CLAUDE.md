# MCQ Quiz Server

MCP Apps server that presents interactive vibecoding quiz cards inline in Claude conversations.

## Architecture

One question per tool call — Claude drives the quiz conversationally.

- `server.ts` — MCP server with tools (`quiz-question`, `submit-answer`) and `ui://` resource
- `main.ts` — Entry point supporting stdio (Claude Desktop) and HTTP transports
- `src/mcp-app.tsx` — React app entry point (bundled by Vite into single HTML file)
- `src/components/` — QuizCard, AnswerOption, FeedbackPanel
- `src/quiz-data.ts` — 30 vibecoding MCQs across 3 topics
- `src/types.ts` — QuizItem interface

## Commands

- `npm run build` — Build client (Vite) then server (tsc)
- `npm run dev` — Run the HTTP server (port 3456)
- `npm run start:stdio` — Run in stdio mode for Claude Desktop

## How it works

1. LLM calls `quiz-question` → picks a question, returns it + opens UI
2. UI renders QuizCard with 4 answer option cards, user clicks one
3. UI calls `submit-answer` (app-only tool) → server returns feedback
4. UI shows correct/wrong feedback with explanation
5. `updateModelContext()` pushes the answer result back into conversation
6. Claude reacts conversationally, then calls `quiz-question` again for next question
7. Session ID tracks shown questions to avoid repeats

## Dependencies

- `@modelcontextprotocol/ext-apps` — MCP Apps SDK (registerAppTool, useApp)
- `@modelcontextprotocol/sdk` — MCP SDK (McpServer, transports)
- `vite-plugin-singlefile` — Bundles React app into single HTML for ui:// resource
