interface FeedbackPanelProps {
  correct: boolean;
  explanation: string;
  isLastQuestion: boolean;
  onNext: () => void;
}

export function FeedbackPanel({
  correct,
  explanation,
  isLastQuestion,
  onNext,
}: FeedbackPanelProps) {
  return (
    <div className={`feedback-panel ${correct ? "correct" : "wrong"}`}>
      <div className="feedback-header">
        <span className="feedback-icon">{correct ? "\u2713" : "\u2717"}</span>
        <span className="feedback-title">
          {correct ? "Correct!" : "Not quite"}
        </span>
      </div>
      <p className="feedback-explanation">{explanation}</p>
      <button
        className={`next-button ${correct ? "correct" : "wrong"}`}
        onClick={onNext}
      >
        {isLastQuestion ? "See Results" : "Next Question"}
        {" \u2192"}
      </button>
    </div>
  );
}
