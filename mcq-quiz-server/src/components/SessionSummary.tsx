import type { QuizResults } from "../types";

interface SessionSummaryProps {
  results: QuizResults;
  onRestart: () => void;
}

function getEmoji(score: number): string {
  if (score >= 90) return "\u{1F3C6}";
  if (score >= 70) return "\u{1F389}";
  if (score >= 50) return "\u{1F4AA}";
  return "\u{1F4DA}";
}

function getMessage(score: number): string {
  if (score >= 90) return "Outstanding!";
  if (score >= 70) return "Great job!";
  if (score >= 50) return "Good effort!";
  return "Keep learning!";
}

function getSubtitle(score: number): string {
  if (score >= 90) return "You really know your vibecoding.";
  if (score >= 70) return "You're well on your way.";
  if (score >= 50) return "A solid foundation to build on.";
  return "Every expert was once a beginner.";
}

export function SessionSummary({ results, onRestart }: SessionSummaryProps) {
  const scorePercent = Math.round(results.score * 100);

  return (
    <div className="session-summary">
      <div className="summary-header">
        <div className="summary-emoji">{getEmoji(scorePercent)}</div>
        <h2 className="summary-title">{getMessage(scorePercent)}</h2>
        <p className="summary-subtitle">{getSubtitle(scorePercent)}</p>
      </div>

      <div className="score-display">
        <div className="score-item">
          <div className="score-value">{scorePercent}%</div>
          <div className="score-label">Score</div>
        </div>
        <div className="score-item">
          <div className="score-value">
            {results.correctCount}/{results.totalQuestions}
          </div>
          <div className="score-label">Correct</div>
        </div>
      </div>

      <div className="review-list">
        {results.perQuestion.map((q, i) => (
          <div key={i} className="review-item">
            <span className="review-icon">{q.correct ? "\u2713" : "\u2717"}</span>
            <span className="review-question">{q.question}</span>
          </div>
        ))}
      </div>

      <button className="restart-button" onClick={onRestart}>
        Try Another Quiz
      </button>
    </div>
  );
}
