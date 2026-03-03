import Link from 'next/link';
import { getPublicUsers } from '@/lib/supabase';

export const revalidate = 60;

export default async function PeoplePage() {
  const users = await getPublicUsers(50);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
        style={{ backgroundColor: 'rgba(255, 253, 249, 0.9)', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
          >
            codevibing
          </Link>
          <nav className="flex gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            <Link href="/feed" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>feed</Link>
            <Link href="/people" className="font-medium" style={{ color: 'var(--color-accent)' }}>people</Link>
            <Link href="/c" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>communities</Link>
            <Link href="https://learnvibecoding.vercel.app" className="transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>learn</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            People
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Humans building with Claude Code
          </p>
        </div>

        {users.length === 0 ? (
          <div
            className="text-center py-12 border border-dashed rounded-xl"
            style={{ borderColor: 'var(--color-warm-border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No people yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {users.map(user => (
              <Link
                key={user.username}
                href={`/u/${user.username}`}
                className="rounded-xl p-4 border transition-all hover:shadow-sm hover:-translate-y-0.5 text-center"
                style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-xl font-medium"
                  style={{
                    backgroundColor: '#F5F0EB',
                    color: 'var(--color-accent)',
                    ...(user.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', color: 'transparent' } : {}),
                  }}
                >
                  {!user.avatar && (user.display_name?.charAt(0) || user.username.charAt(0)).toUpperCase()}
                </div>
                <div className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                  {user.display_name || user.username}
                </div>
                <div className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  @{user.username}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
