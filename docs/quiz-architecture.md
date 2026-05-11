# Quiz Architecture

## Quiz Types

| Type | Location | Interface | Model | Questions | Persistence |
|------|----------|-----------|-------|-----------|-------------|
| **MCP Quiz** | `mcq-quiz-server/` | Interactive UI inside Claude Desktop | Whatever model the user runs | 30 (3 topics) | None — conversational only |
| **AI Quiz Chat** | learnvibecoding `/quiz-chat` | Web chat | Gemini 3 Flash | 96 (11 topics) + AI-generated | Supabase + localStorage XP |
| **Static Quiz** | learnvibecoding `/quiz` | Traditional web form | None (pre-authored) | 96 (11 topics) | Confidence ratings, localStorage |
| **Physics AI Quiz** | learnvibecoding `/physicsdemo/quiz-chat` | Web chat | Gemini 3 Flash | 20 + AI-generated | Supabase |
| **Physics Static Quiz** | learnvibecoding `/physicsdemo/quiz` | Traditional web form | None | 20 | None |

## How the AI Quiz Chat works (web)

```
User types message
  → useChat() sends to POST /api/quiz-chat
    → Gemini calls quizQuestion tool
      → pickRandomQuestion(shownIds, topic) returns question
    → Gemini streams conversational wrapper around tool result
  → Chat.tsx renders QuizCard from tool invocation
User clicks answer
  → handleQuizAnswer() sends "[Quiz Answer] [qid:...] ..." as next message
    → API regex-parses answer text, logs to Supabase quiz_answers table
    → Gemini sees the answer in conversation, responds naturally
    → saveQuizResult() updates local XP
    → reportProgress() updates team dashboard (if in team)
```

Session state: shown question IDs are reconstructed from message history on each request. No server-side session store.

## How the MCP Quiz works

```
Claude calls quiz-question tool (topic, sessionId)
  → Server picks random question, tracks shownIds in session Map
  → Returns structuredContent with question data
  → React UI renders in Claude Desktop iframe via MCP Apps SDK
User clicks answer in iframe
  → React calls app.callServerTool("submit-answer", {questionId, selectedIndex})
  → Server checks correctness, returns feedback via structuredContent
  → React calls app.updateModelContext() to push result text into conversation
  → Claude reads "[Quiz Answer] Question: ... — CORRECT/INCORRECT"
  → Claude calls quiz-question again
```

Session state: server-side Map with 30-minute TTL. submit-answer tool has `visibility: ["app"]` — only callable from the UI, not from Claude directly.

## Would MCP benefit the AI Quiz Chat?

### Benefits

**Richer interaction inside Claude.** The MCP quiz renders interactive cards directly in Claude Desktop — no browser tab needed. For users already in Claude Code, this is zero-friction. They say "quiz me" and cards appear inline.

**Model-agnostic.** The MCP server doesn't care which model drives it. The web version is hardcoded to Gemini 3 Flash. An MCP quiz could run with Opus, Sonnet, or any model the user has configured.

**Structured tool responses.** MCP tools return typed data. The web version encodes answers as regex-parseable text (`[Quiz Answer] [qid:basics-1] ...`) which is fragile. MCP's `submit-answer` returns `{ correct: boolean, explanation: string }` cleanly.

**No hosting cost.** Runs locally via stdio. No Vercel edge function, no API route, no streaming infrastructure.

**Privacy.** Questions and answers never leave the user's machine (stdio transport). The web version sends everything through Vercel to Google's API.

### Harms

**No persistence.** The MCP quiz has no Supabase integration. Answers aren't logged, there's no XP system, no team progress reporting. The user's quiz history vanishes when the session expires (30 min). The web version tracks everything — individual answers, generated questions, team progress, skill maps.

**No AI-generated questions.** The MCP server only has `quiz-question` (pick from bank). The web version has `generateQuestion` which lets the AI create novel questions on any topic. This is the key feature that makes the web quiz adaptive — when the bank runs out or the user wants a custom topic, the AI improvises.

**Smaller question bank.** 30 questions (3 topics) vs 96 questions (11 topics). The web version has 3x the content.

**Limited reach.** MCP only works in Claude Desktop or Claude Code. The web quiz works in any browser. For a community platform (codevibing.com) or learning site (learnvibecoding), browser access is essential.

**Weaker context.** The MCP quiz pushes plain text ("[Quiz Answer] ... CORRECT") back to Claude via updateModelContext(). Claude doesn't accumulate structured performance data — it just sees text fragments. The web version keeps the full conversation in Gemini's context window, so the AI can say "you've gotten 4/5 on this topic, let's try something harder." The MCP version can only do this if Claude manually tracks it from the text pushes.

**No team integration.** The web quiz plugs into the team system (journey steps, manager dashboard, progress events). MCP has no concept of teams or shared progress.

**Fragile session management.** Server-side session Map with 30-minute TTL and periodic cleanup. If the server restarts, all sessions are lost. The web version reconstructs state from message history — stateless and resilient.

### Verdict

MCP is great for **personal practice inside Claude** — low friction, private, model-agnostic. But it's missing everything that makes the quiz useful for learning: persistence, adaptivity (AI-generated questions), team integration, and browser access.

The right move isn't to replace the web quiz with MCP — it's to keep MCP as a **companion entry point** that shares the same question bank and optionally logs results to the same Supabase backend. A user could quiz themselves in Claude Code, and their progress would show up on their codevibing profile and team dashboard.

To get there, the MCP server needs:
1. Supabase integration for answer logging (optional, if env vars present)
2. Import from the 96-question bank instead of its own 30-question copy
3. A `generateQuestion` tool matching the web version
4. Team context support (pass team slug + member ID)
