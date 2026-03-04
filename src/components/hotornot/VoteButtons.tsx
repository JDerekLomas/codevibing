'use client';

interface VoteButtonsProps {
  onVote: (score: 0 | 1) => void;
  disabled?: boolean;
}

export default function VoteButtons({ onVote, disabled }: VoteButtonsProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      <button
        onClick={() => onVote(0)}
        disabled={disabled}
        className="flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'white',
          borderColor: 'var(--color-warm-border)',
          border: '2px solid var(--color-warm-border)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span className="text-lg">&#10005;</span> Not
      </button>
      <button
        onClick={() => onVote(1)}
        disabled={disabled}
        className="flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'white',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Hot <span className="text-lg">&#128293;</span>
      </button>
    </div>
  );
}
