import type { App } from "@modelcontextprotocol/ext-apps";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QuizCard } from "./components/QuizCard";
import { FeedbackPanel } from "./components/FeedbackPanel";
import type { QuizItem } from "./types";
import "./styles.css";

// ── Extract structured data from tool results ────────────────────
function getStructured<T>(result: CallToolResult): T | null {
  const sc = (result as Record<string, unknown>).structuredContent;
  return (sc as T) ?? null;
}

// ── Data shapes from server ──────────────────────────────────────
interface QuestionData {
  sessionId: string;
  questionId: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  questionNumber: number;
}

interface FeedbackData {
  correct: boolean;
  correctIndex: number;
  selectedIndex: number;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  question: string;
}

// ── Main Quiz App ────────────────────────────────────────────────
function QuizApp() {
  const [toolResult, setToolResult] = useState<CallToolResult | null>(null);

  const { app, error } = useApp({
    appInfo: { name: "Vibecoding Quiz", version: "0.2.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async (result) => {
        setToolResult(result);
      };
      app.onerror = console.error;
    },
  });

  if (error) return <div className="loading">Error: {error.message}</div>;
  if (!app) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Connecting...
      </div>
    );
  }

  return <QuestionUI app={app} initialResult={toolResult} />;
}

// ── Single Question UI ───────────────────────────────────────────
interface QuestionUIProps {
  app: App;
  initialResult: CallToolResult | null;
}

function QuestionUI({ app, initialResult }: QuestionUIProps) {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from quiz-question tool result
  useEffect(() => {
    if (!initialResult) return;
    const data = getStructured<QuestionData>(initialResult);
    if (data?.questionId) {
      setQuestionData(data);
      setSelectedIndex(null);
      setFeedback(null);
    }
  }, [initialResult]);

  // Submit answer when user clicks an option
  const handleSelect = useCallback(
    async (index: number) => {
      if (feedback || isSubmitting || !questionData) return;

      setSelectedIndex(index);
      setIsSubmitting(true);

      try {
        const result = await app.callServerTool({
          name: "submit-answer",
          arguments: {
            questionId: questionData.questionId,
            selectedIndex: index,
          },
        });

        const feedbackData = getStructured<FeedbackData>(result);
        if (feedbackData) {
          setFeedback(feedbackData);

          // Push result back to Claude so it can react conversationally
          await app.updateModelContext({
            content: [
              {
                type: "text",
                text: feedbackData.correct
                  ? `[Quiz Answer] Question: "${feedbackData.question}" — User answered "${feedbackData.selectedAnswer}" — CORRECT! Session ID: ${questionData.sessionId}`
                  : `[Quiz Answer] Question: "${feedbackData.question}" — User answered "${feedbackData.selectedAnswer}" — INCORRECT. Correct answer: "${feedbackData.correctAnswer}". Session ID: ${questionData.sessionId}`,
              },
            ],
          });
        }
      } catch (e) {
        console.error("Failed to submit answer:", e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [app, questionData, feedback, isSubmitting]
  );

  // ── Render ─────────────────────────────────────────────────────

  if (!questionData) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading question...
      </div>
    );
  }

  const quizItem: QuizItem = {
    id: questionData.questionId,
    topic: questionData.topic,
    question: questionData.question,
    options: questionData.options,
    correctIndex: -1,
    explanation: "",
  };

  return (
    <div>
      <QuizCard
        question={quizItem}
        questionNumber={questionData.questionNumber}
        selectedIndex={selectedIndex}
        correctIndex={feedback?.correctIndex ?? null}
        disabled={!!feedback || isSubmitting}
        onSelect={handleSelect}
      />
      {feedback && (
        <FeedbackPanel
          correct={feedback.correct}
          explanation={feedback.explanation}
        />
      )}
    </div>
  );
}

// ── Mount ────────────────────────────────────────────────────────
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QuizApp />
  </StrictMode>
);
