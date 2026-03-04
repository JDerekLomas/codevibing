import Link from 'next/link';

const MEMES = [
  { src: '/memes/01-rick-rubin-vibing.png', alt: 'Rick Rubin producing code by vibes alone' },
  { src: '/memes/03-afraid-to-ask.png', alt: 'I don\'t know what vibe coding is and at this point I\'m too afraid to ask' },
  { src: '/memes/05-what-do-you-want-to-build.png', alt: 'The hardest question: what do you actually want to build?' },
  { src: '/memes/01-misinterpretation.png', alt: 'What I said vs what the AI built' },
  { src: '/memes/04-karpathy-origin.jpg', alt: 'Karpathy\'s original "vibe coding" tweet that started it all' },
  { src: '/memes/01-first-pancake.png', alt: 'Your first project is supposed to be bad — that\'s the first pancake' },
  { src: '/memes/01-how-to-draw-owl.jpg', alt: 'Step 1: draw circles. Step 2: draw the rest of the owl.' },
  { src: '/memes/01-solo-gamedev.jpeg', alt: 'This is fine — solo dev with everything on fire' },
  { src: '/memes/02-vibe-coders-production.jpeg', alt: 'Vibe coders deploying straight to production' },
  { src: '/memes/01-speedrun.png', alt: 'Scope creep speedrun any%' },
  { src: '/memes/02-one-more-feature.png', alt: 'Just one more feature, I promise' },
  { src: '/memes/01-in-case-of-fire.png', alt: 'In case of fire: git commit, git push, leave building' },
  { src: '/memes/01-sharing-localhost.png', alt: 'Trying to share localhost:3000 with someone' },
  { src: '/memes/01-classic.jpg', alt: 'It works on my machine — then we\'ll ship your machine' },
  { src: '/memes/01-dog-driving.png', alt: 'Dog driving a car — when the AI is in flow and you\'re just watching' },
  { src: '/memes/01-soulless-food.png', alt: 'AI-generated code that technically works but has no soul' },
];

export default function MemesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            The vibe
          </h1>
          <Link
            href="/"
            className="text-xs hover:underline"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
          >
            &larr; Back
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MEMES.map((meme) => (
            <div
              key={meme.src}
              className="rounded-lg overflow-hidden border"
              style={{ borderColor: 'var(--color-warm-border)', backgroundColor: 'white' }}
            >
              <img
                src={meme.src}
                alt={meme.alt}
                className="w-full h-auto"
                loading="lazy"
              />
              <p className="px-3 py-2 text-xs leading-snug" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {meme.alt}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
