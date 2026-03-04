import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn Vibe Coding',
  description: 'Structured guides, tutorials, and learning paths for vibe coding. From zero to your first build.',
};

export default function LearnVibecodingPage() {
  return (
    <main className="pt-12">
      <iframe
        src="https://learnvibecoding.vercel.app"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        allow="microphone; clipboard-write"
      />
    </main>
  );
}
