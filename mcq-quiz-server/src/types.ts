export interface QuizItem {
  id: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizSession {
  id: string;
  questions: QuizItem[];
  answers: Array<{ selectedIndex: number; correct: boolean } | null>;
  currentIndex: number;
  startedAt: number;
}

export interface QuizState {
  phase: "answering" | "feedback" | "complete";
  session: QuizSession | null;
  currentFeedback: {
    correct: boolean;
    correctIndex: number;
    explanation: string;
  } | null;
}

export interface SubmitAnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  nextQuestion: QuizItem | null;
  sessionComplete: boolean;
  currentIndex: number;
}

export interface QuizResults {
  totalQuestions: number;
  correctCount: number;
  score: number;
  perQuestion: Array<{
    question: string;
    selectedIndex: number;
    correctIndex: number;
    correct: boolean;
    explanation: string;
  }>;
}
