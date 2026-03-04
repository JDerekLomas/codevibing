'use client';

import Link from 'next/link';

interface TopicFilterProps {
  communities: Array<{ slug: string; name: string; post_count: number }>;
  activeTopic: string | null;
}

export function TopicFilter({ communities, activeTopic }: TopicFilterProps) {
  if (communities.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <Link
        href="/feed"
        className="px-3 py-1.5 rounded-full text-xs border transition-all hover:opacity-80"
        style={{
          fontFamily: 'var(--font-mono)',
          borderColor: !activeTopic ? 'var(--color-accent)' : 'var(--color-warm-border)',
          backgroundColor: !activeTopic ? 'var(--color-accent)' : 'white',
          color: !activeTopic ? 'white' : 'var(--color-text-muted)',
        }}
      >
        all
      </Link>
      {communities.map(c => (
        <Link
          key={c.slug}
          href={`/feed?topic=${c.slug}`}
          className="px-3 py-1.5 rounded-full text-xs border transition-all hover:opacity-80"
          style={{
            fontFamily: 'var(--font-mono)',
            borderColor: activeTopic === c.slug ? 'var(--color-accent)' : 'var(--color-warm-border)',
            backgroundColor: activeTopic === c.slug ? 'var(--color-accent)' : 'white',
            color: activeTopic === c.slug ? 'white' : 'var(--color-text-muted)',
          }}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
