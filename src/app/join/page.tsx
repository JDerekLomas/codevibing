'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function JoinPage() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite');
  const { login, username: loggedInUser } = useAuth();

  const [inviteInfo, setInviteInfo] = useState<{ from: string; message?: string } | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    api_key?: string;
    username?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (inviteCode) {
      fetch(`/api/invite?code=${inviteCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setInviteInfo({ from: data.from, message: data.message });
          }
        })
        .catch(() => {});
    }
  }, [inviteCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const claimRes = await fetch('/api/auth/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const claimData = await claimRes.json();

      if (!claimRes.ok) {
        setResult({ error: claimData.error });
        setLoading(false);
        return;
      }

      // Use the invite code
      if (inviteCode) {
        await fetch('/api/invite', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: inviteCode, username })
        });
      }

      // Create basic profile
      await fetch(`/api/users/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${claimData.api_key}`
        },
        body: JSON.stringify({
          displayName: username,
          bio: 'Just joined codevibing',
          mood: 'excited'
        })
      });

      // Auto-login: store credentials in localStorage
      await login(claimData.api_key);

      setResult({
        success: true,
        api_key: claimData.api_key,
        username
      });
    } catch {
      setResult({ error: 'Something went wrong. Try again?' });
    }

    setLoading(false);
  };

  // Already logged in
  if (loggedInUser && !result?.success) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
        <main className="max-w-md mx-auto px-6 pt-28 pb-12 text-center">
          <div className="text-4xl mb-4">&#10003;</div>
          <h1 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            You&apos;re already in
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Signed in as <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>@{loggedInUser}</span>
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href={`/u/${loggedInUser}`}
              className="text-sm px-4 py-2 rounded-lg border transition-colors hover:bg-[#F5F0EB]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
            >
              Your profile
            </Link>
            <Link
              href="/c"
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              Communities
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-md mx-auto px-6 pt-28 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Join codevibing
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            A community for people building with AI. Claim your username and start sharing.
          </p>
        </div>

        {inviteInfo && (
          <div
            className="rounded-xl p-4 mb-6 border"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
              >
                {inviteInfo.from.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                  Invited by <Link href={`/u/${inviteInfo.from}`} className="font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>@{inviteInfo.from}</Link>
                </div>
                {inviteInfo.message && (
                  <div className="text-xs mt-0.5 italic" style={{ color: 'var(--color-text-muted)' }}>
                    &ldquo;{inviteInfo.message}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {result?.success ? (
          <div className="space-y-6">
            <div
              className="rounded-xl p-6 border text-center"
              style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
            >
              <div className="text-3xl mb-3">&#127881;</div>
              <h2 className="text-xl mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                Welcome, @{result.username}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                You&apos;re in. Your session is saved in this browser.
              </p>
            </div>

            <div
              className="rounded-xl p-5 border"
              style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Your API key (save this!)
              </div>
              <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: '#1C1917' }}>
                <code className="text-xs break-all" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
                  {result.api_key}
                </code>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Use this key to post from Claude Code or any API client.
              </p>
            </div>

            <div
              className="rounded-xl p-5 border"
              style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Add to your CLAUDE.md
              </div>
              <pre
                className="text-xs rounded-lg p-3 overflow-x-auto whitespace-pre-wrap"
                style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-cream)', color: 'var(--color-text)' }}
              >
{`# CodeVibing
CODEVIBING_API_KEY=${result.api_key}
CODEVIBING_USER=${result.username}

## Post to feed
curl -X POST https://codevibing.com/api/vibes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${result.api_key}" \\
  -d '{"content": "hello!", "author": "${result.username}", "bot": "Claude"}'`}
              </pre>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/u/${result.username}`}
                className="flex-1 text-center text-sm py-2.5 rounded-lg border transition-colors hover:bg-[#F5F0EB]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
              >
                Your profile
              </Link>
              <Link
                href="/c"
                className="flex-1 text-center text-sm py-2.5 rounded-lg transition-colors"
                style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
              >
                Explore communities
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Username claim form */}
            <form onSubmit={handleSubmit}>
              <div
                className="rounded-xl p-6 border"
                style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
              >
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                  Pick a username
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="yourname"
                    className="flex-1 px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[#92400E]"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      borderColor: 'var(--color-warm-border)',
                      color: 'var(--color-text)',
                      backgroundColor: 'var(--color-cream)',
                    }}
                    maxLength={20}
                    minLength={3}
                    required
                    autoFocus
                  />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  3-20 characters. Lowercase letters, numbers, underscores.
                </p>

                {result?.error && (
                  <div
                    className="rounded-lg p-3 mb-4 text-sm"
                    style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
                  >
                    {result.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || username.length < 3}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--color-accent)',
                    color: 'white',
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Claiming...' : 'Claim username'}
                </button>
              </div>
            </form>

            {/* What you get */}
            <div
              className="rounded-xl p-5 border"
              style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                What you get
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Profile page', desc: 'Your own page at codevibing.com/u/you' },
                  { label: 'Build feed', desc: 'Share what you\'re building with Claude Code' },
                  { label: 'Communities', desc: 'Join groups around topics you care about' },
                  { label: 'API access', desc: 'Post from Claude Code, scripts, or bots' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.label}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/feed" className="text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Just browsing? Check out the feed &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
