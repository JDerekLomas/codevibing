import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { pickQuizQuestions, topics } from "./src/quiz-data.js";
import type { QuizSession } from "./src/types.js";

// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

// ── Session store ──────────────────────────────────────────────────
const sessions = new Map<string, QuizSession>();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.startedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanExpiredSessions, 5 * 60 * 1000).unref();

// ── Server creation ────────────────────────────────────────────────
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Vibecoding Quiz",
    version: "0.1.0",
  });

  const resourceUri = "ui://start-quiz/mcp-app.html";

  // ── Tool: start-quiz (LLM-facing, opens the UI) ────────────────
  registerAppTool(
    server,
    "start-quiz",
    {
      title: "Start Vibecoding Quiz",
      description:
        "Start an interactive vibecoding quiz session. The user will see a visual quiz card with multiple-choice questions about vibecoding concepts. Available topics: " +
        topics.join(", ") +
        ".",
      inputSchema: {
        topic: z
          .enum(topics)
          .optional()
          .describe("Quiz topic to focus on. Leave empty for mixed topics."),
        count: z
          .number()
          .min(3)
          .max(10)
          .optional()
          .describe("Number of questions (default 7, max 10)."),
      },
      _meta: { ui: { resourceUri } },
    },
    async ({ topic, count: requestedCount }) => {
      const count = Math.min(requestedCount || 7, 10);
      const questions = pickQuizQuestions(count, topic);

      if (questions.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No questions found for topic "${topic}". Available topics: ${topics.join(", ")}`,
            },
          ],
        };
      }

      const session: QuizSession = {
        id: uuidv4(),
        questions,
        answers: new Array(questions.length).fill(null),
        currentIndex: 0,
        startedAt: Date.now(),
      };

      sessions.set(session.id, session);

      const firstQuestion = questions[0];

      return {
        content: [
          {
            type: "text" as const,
            text: `Started a ${questions.length}-question quiz${topic ? ` on "${topic}"` : ""}. The interactive quiz card is now displayed — the user can answer directly in the UI.`,
          },
        ],
        structuredContent: {
          sessionId: session.id,
          totalQuestions: questions.length,
          currentIndex: 0,
          question: {
            id: firstQuestion.id,
            topic: firstQuestion.topic,
            question: firstQuestion.question,
            options: firstQuestion.options,
          },
        },
      };
    }
  );

  // ── Tool: submit-answer (app-only, called from iframe) ──────────
  registerAppTool(
    server,
    "submit-answer",
    {
      title: "Submit Quiz Answer",
      description:
        "Submit an answer for the current quiz question. Called from the quiz UI.",
      inputSchema: {
        sessionId: z.string().describe("Quiz session ID"),
        questionIndex: z.number().describe("Index of the question being answered"),
        selectedIndex: z.number().describe("Index of the selected answer (0-3)"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async ({ sessionId, questionIndex, selectedIndex }) => {
      const session = sessions.get(sessionId);
      if (!session) {
        return {
          content: [{ type: "text" as const, text: "Session not found or expired." }],
          isError: true,
        };
      }

      const question = session.questions[questionIndex];
      if (!question) {
        return {
          content: [{ type: "text" as const, text: "Invalid question index." }],
          isError: true,
        };
      }

      const correct = selectedIndex === question.correctIndex;

      session.answers[questionIndex] = {
        selectedIndex,
        correct,
      };

      const isLast = questionIndex >= session.questions.length - 1;
      const nextIdx = questionIndex + 1;
      const nextQuestion =
        !isLast && session.questions[nextIdx]
          ? session.questions[nextIdx]
          : null;

      if (!isLast) {
        session.currentIndex = nextIdx;
      }

      return {
        content: [
          {
            type: "text" as const,
            text: correct ? "Correct!" : "Incorrect.",
          },
        ],
        structuredContent: {
          correct,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
          nextQuestion: nextQuestion
            ? {
                id: nextQuestion.id,
                topic: nextQuestion.topic,
                question: nextQuestion.question,
                options: nextQuestion.options,
                correctIndex: -1,
                explanation: "",
              }
            : null,
          sessionComplete: isLast,
          currentIndex: isLast ? questionIndex : nextIdx,
        },
      };
    }
  );

  // ── Tool: get-results (app-only, called from iframe) ────────────
  registerAppTool(
    server,
    "get-results",
    {
      title: "Get Quiz Results",
      description:
        "Get the final results for a completed quiz session. Called from the quiz UI.",
      inputSchema: {
        sessionId: z.string().describe("Quiz session ID"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async ({ sessionId }) => {
      const session = sessions.get(sessionId);
      if (!session) {
        return {
          content: [{ type: "text" as const, text: "Session not found or expired." }],
          isError: true,
        };
      }

      const answeredQuestions = session.answers.filter(
        (a) => a !== null
      ).length;
      const correctCount = session.answers.filter(
        (a) => a !== null && a.correct
      ).length;
      const score = answeredQuestions > 0 ? correctCount / answeredQuestions : 0;

      return {
        content: [
          {
            type: "text" as const,
            text: `Quiz complete! Score: ${correctCount}/${session.questions.length} (${Math.round(score * 100)}%)`,
          },
        ],
        structuredContent: {
          totalQuestions: session.questions.length,
          correctCount,
          score,
          perQuestion: session.questions.map((q, i) => {
            const answer = session.answers[i];
            return {
              question: q.question,
              selectedIndex: answer?.selectedIndex ?? -1,
              correctIndex: q.correctIndex,
              correct: answer?.correct ?? false,
              explanation: q.explanation,
            };
          }),
        },
      };
    }
  );

  // ── Resource: bundled React app ─────────────────────────────────
  registerAppResource(
    server,
    "Vibecoding Quiz UI",
    resourceUri,
    {
      mimeType: RESOURCE_MIME_TYPE,
      description: "Interactive vibecoding quiz UI",
    },
    async (): Promise<ReadResourceResult> => {
      const htmlPath = path.join(DIST_DIR, "mcp-app.html");
      const html = await fs.readFile(htmlPath, "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    }
  );

  return server;
}
