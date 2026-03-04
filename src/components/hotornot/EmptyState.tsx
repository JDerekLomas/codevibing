'use client';

import Link from 'next/link';

interface EmptyStateProps {
  totalRated: number;
}

export default function EmptyState({ totalRated }: EmptyStateProps): JSX.Element {
  return (
    <div className="text-center py-16">
      <div
        className="text-5xl mb-4"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
      >
        &#128079;
      </div>
      <h2
        className="text-xl mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
      >
        You&apos;ve rated all {totalRated} projects!
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Come back as more people share their builds.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/hotornot/trending"
          className="px-5 py-2.5 rounded-full text-sm transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            fontFamily: 'var(--font-mono)',
          }}
        >
          See rankings &rarr;
        </Link>
        <Link
          href="/feed"
          className="px-5 py-2.5 rounded-full text-sm border transition-all hover:-translate-y-0.5"
          style={{
            borderColor: 'var(--color-warm-border)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Back to feed
        </Link>
      </div>
    </div>
  );
}
