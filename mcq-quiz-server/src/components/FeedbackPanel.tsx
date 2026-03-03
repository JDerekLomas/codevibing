interface FeedbackPanelProps {
  correct: boolean;
  explanation: string;
}

export function FeedbackPanel({ correct, explanation }: FeedbackPanelProps) {
  return (
    <div className={`feedback-panel ${correct ? "correct" : "wrong"}`}>
      <div className="feedback-header">
        <span className="feedback-icon">{correct ? "\u2713" : "\u2717"}</span>
        <span className="feedback-title">
          {correct ? "Correct!" : "Not quite"}
        </span>
      </div>
      <p className="feedback-explanation">{explanation}</p>
    </div>
  );
}
