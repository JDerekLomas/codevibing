import type { QuizSession } from "../types";

interface ProgressBarProps {
  session: QuizSession;
}

export function ProgressBar({ session }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      {session.questions.map((_, i) => {
        const answer = session.answers[i];
        let className = "progress-dot";
        if (answer) {
          className += answer.correct ? " correct" : " wrong";
        } else if (i === session.currentIndex) {
          className += " current";
        }
        return <div key={i} className={className} />;
      })}
    </div>
  );
}
