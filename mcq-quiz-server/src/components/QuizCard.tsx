import type { QuizItem } from "../types";
import { AnswerOption } from "./AnswerOption";

interface QuizCardProps {
  question: QuizItem;
  questionNumber: number;
  totalQuestions: number;
  selectedIndex: number | null;
  correctIndex: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  correctIndex,
  disabled,
  onSelect,
}: QuizCardProps) {
  return (
    <div className="quiz-card" key={question.id}>
      <div className="question-counter">
        Question {questionNumber} of {totalQuestions}
      </div>
      <div className="topic-label">{question.topic}</div>
      <h2 className="question-text">{question.question}</h2>
      <div className="answer-options">
        {question.options.map((option, i) => (
          <AnswerOption
            key={i}
            index={i}
            text={option}
            selected={selectedIndex === i}
            correctIndex={correctIndex}
            disabled={disabled}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
