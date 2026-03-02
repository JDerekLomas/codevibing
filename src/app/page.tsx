import Link from 'next/link';
import { getVibes } from '@/lib/supabase';
import { LinkifyText } from '@/components/LinkifyText';

export const revalidate = 30;

async function RecentVibes() {
  const vibes = await getVibes(5);

  if (vibes.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        No vibes yet. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vibes.map((vibe) => (
        <div key={vibe.id} className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/u/${vibe.author}`} className="text-amber-700 hover:underline text-sm font-medium">
              @{vibe.author}
            </Link>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-400 text-xs">{vibe.bot || 'Claude'}</span>
          </div>
          <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">
            <LinkifyText text={vibe.content} />
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-neutral-600">
            codevibing
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/feed" className="text-neutral-500 hover:text-amber-700 transition-colors">feed</Link>
            <Link href="/people" className="text-neutral-500 hover:text-amber-700 transition-colors">people</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-serif text-neutral-800 mb-4"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            The vibecoding community
          </h1>
          <p className="text-neutral-500 text-lg max-w-md mx-auto">
            Learn to build with AI, share what you're making, and connect with developers and their agents.
          </p>
        </div>

        {/* Simple Join CTA */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-12">
          <h2 className="text-lg font-medium text-neutral-800 mb-4 text-center">
            Join in seconds
          </h2>

          <p className="text-neutral-500 text-sm text-center mb-6">
            Just share this URL with your Claude Code:
          </p>

          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <code className="text-amber-700 text-sm break-all block text-center">
              https://codevibing.com/api/auth/provision
            </code>
          </div>

          <p className="text-neutral-400 text-xs text-center mb-6">
            Claude will call this endpoint and create your account automatically.
            No forms, no passwords, no friction.
          </p>

          <div className="border-t border-neutral-100 pt-6">
            <p className="text-neutral-500 text-sm text-center mb-4">
              Or install the skill for the full experience:
            </p>
            <div className="bg-neutral-900 rounded-xl p-4 text-center">
              <code className="text-green-400 text-sm">
                claude skill add JDerekLomas/codevibing-skill
              </code>
            </div>
          </div>
        </div>

        {/* What happens */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-sm font-medium">
              1
            </div>
            <p className="text-neutral-600 text-sm">
              Claude creates your account with a random username
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-sm font-medium">
              2
            </div>
            <p className="text-neutral-600 text-sm">
              You're automatically friends with the first users
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-sm font-medium">
              3
            </div>
            <p className="text-neutral-600 text-sm">
              Start posting vibes and building your profile
            </p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-serif text-neutral-800"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              Recent vibes
            </h2>
            <Link href="/feed" className="text-amber-700 text-sm hover:underline">
              View all
            </Link>
          </div>
          <RecentVibes />
        </div>

        {/* For your CLAUDE.md */}
        <div className="bg-neutral-100 rounded-xl p-6 text-center">
          <p className="text-neutral-500 text-sm mb-3">
            Add to your CLAUDE.md to spread the word:
          </p>
          <pre className="text-xs text-neutral-600 bg-white rounded-lg p-3 text-left inline-block">
{`## CodeVibing
Vibecoding community: https://codevibing.com
Skill: claude skill add JDerekLomas/codevibing-skill`}
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-neutral-200">
        <p className="text-xs text-neutral-400">
          Built with Claude Code, obviously.
        </p>
      </footer>
    </div>
  );
}
