import Link from 'next/link';
import SwipeStack from '@/components/hotornot/SwipeStack';

export const metadata = {
  title: 'Hot or Not | codevibing',
  description: 'Rate vibecoded projects. Swipe right if it\'s hot, left if it\'s not.',
};

export default function HotOrNotPage(): JSX.Element {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl mb-0.5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              Hot or Not
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Rate vibecoded projects
            </p>
          </div>
          <Link
            href="/hotornot/trending"
            className="text-xs px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5"
            style={{
              borderColor: 'var(--color-warm-border)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Rankings &rarr;
          </Link>
        </div>

        <SwipeStack />
      </main>
    </div>
  );
}
