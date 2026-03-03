import type { App } from "@modelcontextprotocol/ext-apps";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QuizCard } from "./components/QuizCard";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { ProgressBar } from "./components/ProgressBar";
import { SessionSummary } from "./components/SessionSummary";
import type { QuizItem, QuizSession, QuizState, QuizResults } from "./types";
import "./styles.css";

// ── Extract structured data from tool results ────────────────────
function getStructured<T>(result: CallToolResult): T | null {
  // structuredContent is the rich data from the MCP server
  const sc = (result as Record<string, unknown>).structuredContent;
  return (sc as T) ?? null;
}

// ── Main Quiz App ────────────────────────────────────────────────
function QuizApp() {
  const [toolResult, setToolResult] = useState<CallToolResult | null>(null);

  const { app, error } = useApp({
    appInfo: { name: "Vibecoding Quiz", version: "0.1.0" },
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

  return <QuizUI app={app} initialResult={toolResult} />;
}

// ── Quiz UI Logic ────────────────────────────────────────────────
interface QuizUIProps {
  app: App;
  initialResult: CallToolResult | null;
}

interface StartQuizData {
  sessionId: string;
  totalQuestions: number;
  currentIndex: number;
  question: {
    id: string;
    topic: string;
    question: string;
    options: [string, string, string, string];
  };
}

function QuizUI({ app, initialResult }: QuizUIProps) {
  const [state, setState] = useState<QuizState>({
    phase: "answering",
    session: null,
    currentFeedback: null,
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from the start-quiz tool result
  useEffect(() => {
    if (!initialResult) return;
    const data = getStructured<StartQuizData>(initialResult);
    if (!data?.sessionId) return;

    const firstQuestion: QuizItem = {
      id: data.question.id,
      topic: data.question.topic,
      question: data.question.question,
      options: data.question.options,
      correctIndex: -1,
      explanation: "",
    };

    const session: QuizSession = {
      id: data.sessionId,
      questions: [firstQuestion],
      answers: new Array(data.totalQuestions).fill(null),
      currentIndex: 0,
      startedAt: Date.now(),
    };

    setState({
      phase: "answering",
      session,
      currentFeedback: null,
    });
    setSelectedIndex(null);
    setResults(null);
  }, [initialResult]);

  // Submit answer
  const handleSelect = useCallback(
    async (index: number) => {
      if (state.phase !== "answering" || !state.session || isSubmitting) return;

      setSelectedIndex(index);
      setIsSubmitting(true);

      try {
        const result = await app.callServerTool({
          name: "submit-answer",
          arguments: {
            sessionId: state.session.id,
            questionIndex: state.session.currentIndex,
            selectedIndex: index,
          },
        });

        const feedback = getStructured<{
          correct: boolean;
          correctIndex: number;
          explanation: string;
          nextQuestion: QuizItem | null;
          sessionComplete: boolean;
          currentIndex: number;
        }>(result);

        if (!feedback) return;

        setState((prev) => {
          if (!prev.session) return prev;
          const newAnswers = [...prev.session.answers];
          newAnswers[prev.session.currentIndex] = {
            selectedIndex: index,
            correct: feedback.correct,
          };

          const newQuestions = [...prev.session.questions];
          if (feedback.nextQuestion) {
            // Add next question if we haven't seen it yet
            if (newQuestions.length <= feedback.currentIndex) {
              newQuestions.push(feedback.nextQuestion);
            }
          }

          return {
            phase: "feedback",
            session: {
              ...prev.session,
              answers: newAnswers,
              questions: newQuestions,
            },
            currentFeedback: {
              correct: feedback.correct,
              correctIndex: feedback.correctIndex,
              explanation: feedback.explanation,
            },
          };
        });
      } catch (e) {
        console.error("Failed to submit answer:", e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [app, state.phase, state.session, isSubmitting]
  );

  // Next question or show results
  const handleNext = useCallback(async () => {
    if (!state.session) return;

    const nextIndex = state.session.currentIndex + 1;
    const isComplete = nextIndex >= state.session.answers.length;

    if (isComplete) {
      // Fetch final results
      try {
        const result = await app.callServerTool({
          name: "get-results",
          arguments: { sessionId: state.session.id },
        });

        const quizResults = getStructured<QuizResults>(result);
        if (quizResults) {
          setResults(quizResults);
          setState((prev) => ({
            ...prev,
            phase: "complete",
          }));

          // Push results back into conversation context
          await app.updateModelContext({
            content: [
              {
                type: "text",
                text: `Quiz completed! Score: ${quizResults.correctCount}/${quizResults.totalQuestions} (${Math.round(quizResults.score * 100)}%). ${quizResults.perQuestion.filter((q) => !q.correct).length > 0 ? `Missed: ${quizResults.perQuestion.filter((q) => !q.correct).map((q) => q.question).join("; ")}` : "Perfect score!"}`,
              },
            ],
          });
        }
      } catch (e) {
        console.error("Failed to get results:", e);
      }
    } else {
      // Move to next question
      setState((prev) => {
        if (!prev.session) return prev;
        return {
          phase: "answering",
          session: {
            ...prev.session,
            currentIndex: nextIndex,
          },
          currentFeedback: null,
        };
      });
      setSelectedIndex(null);
    }
  }, [app, state.session]);

  // Restart quiz
  const handleRestart = useCallback(async () => {
    try {
      const result = await app.callServerTool({
        name: "start-quiz",
        arguments: {},
      });

      const data = getStructured<StartQuizData>(result);
      if (!data?.sessionId) return;

      const firstQuestion: QuizItem = {
        id: data.question.id,
        topic: data.question.topic,
        question: data.question.question,
        options: data.question.options,
        correctIndex: -1,
        explanation: "",
      };

      const session: QuizSession = {
        id: data.sessionId,
        questions: [firstQuestion],
        answers: new Array(data.totalQuestions).fill(null),
        currentIndex: 0,
        startedAt: Date.now(),
      };

      setState({
        phase: "answering",
        session,
        currentFeedback: null,
      });
      setSelectedIndex(null);
      setResults(null);
    } catch (e) {
      console.error("Failed to restart quiz:", e);
    }
  }, [app]);

  // ── Render ─────────────────────────────────────────────────────

  if (!state.session) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading quiz...
      </div>
    );
  }

  if (state.phase === "complete" && results) {
    return <SessionSummary results={results} onRestart={handleRestart} />;
  }

  const currentQuestion =
    state.session.questions[state.session.currentIndex];

  if (!currentQuestion) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading question...
      </div>
    );
  }

  return (
    <div>
      <ProgressBar session={state.session} />
      <QuizCard
        question={currentQuestion}
        questionNumber={state.session.currentIndex + 1}
        totalQuestions={state.session.answers.length}
        selectedIndex={selectedIndex}
        correctIndex={
          state.phase === "feedback"
            ? state.currentFeedback?.correctIndex ?? null
            : null
        }
        disabled={state.phase === "feedback" || isSubmitting}
        onSelect={handleSelect}
      />
      {state.phase === "feedback" && state.currentFeedback && (
        <FeedbackPanel
          correct={state.currentFeedback.correct}
          explanation={state.currentFeedback.explanation}
          isLastQuestion={
            state.session.currentIndex >=
            state.session.answers.length - 1
          }
          onNext={handleNext}
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
