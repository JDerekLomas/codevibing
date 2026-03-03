import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { quizItems, topics } from "./src/quiz-data.js";

// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

// ── Lightweight session store (tracks shown question IDs) ───────────
const sessions = new Map<string, { shownIds: Set<string>; startedAt: number }>();
const SESSION_TTL_MS = 30 * 60 * 1000;

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.startedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

setInterval(cleanExpiredSessions, 5 * 60 * 1000).unref();

// ── Server creation ────────────────────────────────────────────────
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Vibecoding Quiz",
    version: "0.2.0",
  });

  const resourceUri = "ui://quiz-question/mcp-app.html";

  // ── Tool: quiz-question (LLM-facing, opens the UI) ──────────────
  registerAppTool(
    server,
    "quiz-question",
    {
      title: "Show Quiz Question",
      description:
        "Show an interactive vibecoding quiz question card. The user sees a visual card with 4 answer options and clicks their choice. After they answer, their result (correct/incorrect + what they selected) is sent back to you so you can react conversationally. Call this once per question. Available topics: " +
        topics.join(", ") +
        ".",
      inputSchema: {
        topic: z
          .enum(topics)
          .optional()
          .describe("Quiz topic. Leave empty for random."),
        sessionId: z
          .string()
          .optional()
          .describe(
            "Session ID to continue (avoids repeat questions). Omit for first question."
          ),
      },
      _meta: { ui: { resourceUri } },
    },
    async ({ topic, sessionId }) => {
      let session = sessionId ? sessions.get(sessionId) : null;
      if (!session) {
        sessionId = crypto.randomUUID();
        session = { shownIds: new Set(), startedAt: Date.now() };
        sessions.set(sessionId, session);
      }

      const available = quizItems.filter(
        (q) => !session!.shownIds.has(q.id) && (!topic || q.topic === topic)
      );

      if (available.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `All questions have been shown${topic ? ` for "${topic}"` : ""}. ${session.shownIds.size} questions completed in this session.`,
            },
          ],
        };
      }

      const question =
        available[Math.floor(Math.random() * available.length)];
      session.shownIds.add(question.id);

      return {
        content: [
          {
            type: "text" as const,
            text: `Showing question ${session.shownIds.size}: "${question.question}" (Topic: ${question.topic}). The user will answer in the interactive card — wait for their response.`,
          },
        ],
        structuredContent: {
          sessionId,
          questionId: question.id,
          topic: question.topic,
          question: question.question,
          options: question.options,
          questionNumber: session.shownIds.size,
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
        "Submit the user's answer for a quiz question. Called from the quiz UI.",
      inputSchema: {
        questionId: z.string().describe("Question ID"),
        selectedIndex: z
          .number()
          .describe("Index of the selected answer (0-3)"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async ({ questionId, selectedIndex }) => {
      const question = quizItems.find((q) => q.id === questionId);
      if (!question) {
        return {
          content: [
            { type: "text" as const, text: "Question not found." },
          ],
          isError: true,
        };
      }

      const correct = selectedIndex === question.correctIndex;
      const selectedAnswer = question.options[selectedIndex];
      const correctAnswer = question.options[question.correctIndex];

      return {
        content: [
          {
            type: "text" as const,
            text: correct
              ? `Correct! "${selectedAnswer}" is right.`
              : `Incorrect. Selected "${selectedAnswer}", correct answer was "${correctAnswer}".`,
          },
        ],
        structuredContent: {
          correct,
          correctIndex: question.correctIndex,
          selectedIndex,
          selectedAnswer,
          correctAnswer,
          explanation: question.explanation,
          question: question.question,
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
      description: "Interactive vibecoding quiz question card",
    },
    async (): Promise<ReadResourceResult> => {
      const htmlPath = path.join(DIST_DIR, "mcp-app.html");
      const html = await fs.readFile(htmlPath, "utf-8");
      return {
        contents: [
          { uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html },
        ],
      };
    }
  );

  return server;
}
