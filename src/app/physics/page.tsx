import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Heat & Thermal Energy — Physics Demo',
  description: 'Explore heat through 5 ways to learn: read, quiz, AI tutor, voice, and AI quiz. Built with Claude Code.',
};

export default function PhysicsPage() {
  return (
    <main className="pt-12">
      <iframe
        src="https://learnvibecoding.vercel.app/physicsdemo"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        allow="microphone; clipboard-write"
      />
    </main>
  );
}
