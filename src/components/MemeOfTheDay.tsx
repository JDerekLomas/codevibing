'use client';

import { useState } from 'react';
import Link from 'next/link';

const MEMES = [
  { src: '/memes/01-rick-rubin-vibing.png', alt: 'Rick Rubin producing code by vibes alone' },
  { src: '/memes/03-afraid-to-ask.png', alt: "I don't know what vibe coding is and at this point I'm too afraid to ask" },
  { src: '/memes/05-what-do-you-want-to-build.png', alt: 'The hardest question: what do you actually want to build?' },
  { src: '/memes/01-misinterpretation.png', alt: 'What I said vs what the AI built' },
  { src: '/memes/04-karpathy-origin.jpg', alt: "Karpathy's original \"vibe coding\" tweet that started it all" },
  { src: '/memes/01-first-pancake.png', alt: "Your first project is supposed to be bad — that's the first pancake" },
  { src: '/memes/01-how-to-draw-owl.jpg', alt: 'Step 1: draw circles. Step 2: draw the rest of the owl.' },
  { src: '/memes/01-solo-gamedev.jpeg', alt: 'This is fine — solo dev with everything on fire' },
  { src: '/memes/02-vibe-coders-production.jpeg', alt: 'Vibe coders deploying straight to production' },
  { src: '/memes/01-speedrun.png', alt: 'Scope creep speedrun any%' },
  { src: '/memes/02-one-more-feature.png', alt: 'Just one more feature, I promise' },
  { src: '/memes/01-in-case-of-fire.png', alt: 'In case of fire: git commit, git push, leave building' },
  { src: '/memes/01-sharing-localhost.png', alt: 'Trying to share localhost:3000 with someone' },
  { src: '/memes/01-classic.jpg', alt: "It works on my machine — then we'll ship your machine" },
  { src: '/memes/01-dog-driving.png', alt: "Dog driving a car — when the AI is in flow and you're just watching" },
  { src: '/memes/01-soulless-food.png', alt: 'AI-generated code that technically works but has no soul' },
];

function getDailyIndex(): number {
  const now = new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / 86400000);
  return daysSinceEpoch % MEMES.length;
}

export function MemeOfTheDay() {
  const [dismissed, setDismissed] = useState(false);
  const meme = MEMES[getDailyIndex()];

  if (dismissed) return null;

  return (
    <div
      className="mb-4 rounded-xl border overflow-hidden"
      style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-mono)' }}
          >
            meme of the day
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/memes"
            className="text-[11px] hover:underline"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
          >
            see all &rarr;
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-sm leading-none hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-muted)' }}
            title="Dismiss"
          >
            &times;
          </button>
        </div>
      </div>
      <img
        src={meme.src}
        alt={meme.alt}
        className="w-full h-auto"
      />
      <p
        className="px-3 py-2 text-xs leading-snug"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {meme.alt}
      </p>
    </div>
  );
}
