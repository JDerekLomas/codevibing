interface AnswerOptionProps {
  index: number;
  text: string;
  selected: boolean;
  correctIndex: number | null;
  disabled: boolean;
  onClick: () => void;
}

const letters = ["A", "B", "C", "D"];

export function AnswerOption({
  index,
  text,
  selected,
  correctIndex,
  disabled,
  onClick,
}: AnswerOptionProps) {
  let className = "answer-option";

  if (disabled) {
    className += " disabled";
    if (correctIndex !== null) {
      if (index === correctIndex) {
        className += " correct";
      } else if (selected) {
        className += " wrong";
      } else {
        className += " dimmed";
      }
    }
  } else if (selected) {
    className += " selected";
  }

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      <span className="option-letter">{letters[index]}</span>
      <span className="option-text">{text}</span>
    </button>
  );
}
