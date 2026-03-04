'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, username: loggedInUser } = useAuth();

  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle magic link token
  useEffect(() => {
    if (!token) return;

    setVerifying(true);
    setError(null);

    fetch('/api/auth/verify-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(async data => {
        if (data.api_key) {
          await login(data.api_key);
          router.push('/feed');
        } else {
          setError(data.error || 'Login link expired. Request a new one.');
          setVerifying(false);
        }
      })
      .catch(() => {
        setError('Something went wrong. Try requesting a new link.');
        setVerifying(false);
      });
  }, [token, login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (data.sent) {
        setSent(true);
      } else {
        setError(data.error || 'Failed to send login email');
      }
    } catch {
      setError('Something went wrong. Try again.');
    }

    setSending(false);
  };

  // Already logged in
  if (loggedInUser && !token) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
        <main className="max-w-md mx-auto px-6 pt-28 pb-12 text-center">
          <div className="text-4xl mb-4">&#10003;</div>
          <h1 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            You&apos;re logged in
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
              href="/feed"
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              Feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Verifying magic link
  if (verifying) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
        <main className="max-w-md mx-auto px-6 pt-28 pb-12 text-center">
          <div className="text-2xl mb-4" style={{ fontFamily: 'var(--font-mono)' }}>...</div>
          <h1 className="text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Logging you in
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Hang on a sec...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-md mx-auto px-6 pt-28 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Log in
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            We&apos;ll email you a login link. No password needed.
          </p>
        </div>

        {sent ? (
          <div
            className="rounded-xl p-6 border text-center"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
          >
            <div className="text-3xl mb-3">&#9993;</div>
            <h2 className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Check your email
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              If there&apos;s an account with <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{email}</span>, we sent a login link. Check your inbox (and spam).
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-xs hover:underline"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
            >
              Try a different email
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email form */}
            <form onSubmit={handleSubmit}>
              <div
                className="rounded-xl p-6 border"
                style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
              >
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[#92400E] mb-3"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    borderColor: 'var(--color-warm-border)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-cream)',
                  }}
                  required
                  autoFocus
                />

                {error && (
                  <div
                    className="rounded-lg p-3 mb-3 text-sm"
                    style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--color-accent)',
                    color: 'white',
                    cursor: sending ? 'wait' : 'pointer',
                  }}
                >
                  {sending ? 'Sending...' : 'Send login link'}
                </button>
              </div>
            </form>

            {/* API key login */}
            <details className="group">
              <summary
                className="text-xs cursor-pointer text-center list-none"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
              >
                Have your API key? Log in with it instead
              </summary>
              <ApiKeyLogin />
            </details>

            <div className="text-center">
              <Link href="/join" className="text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Don&apos;t have an account? Join &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ApiKeyLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError(null);

    const success = await login(key.trim());
    if (success) {
      router.push('/feed');
    } else {
      setError('Invalid API key');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleKeyLogin} className="mt-4">
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="cv_..."
          className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[#92400E] mb-3"
          style={{
            fontFamily: 'var(--font-mono)',
            borderColor: 'var(--color-warm-border)',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-cream)',
          }}
        />
        {error && (
          <div
            className="rounded-lg p-2 mb-3 text-xs"
            style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !key.trim()}
          className="w-full py-2 rounded-lg text-xs font-medium transition-opacity disabled:opacity-50"
          style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-text)',
            color: 'white',
          }}
        >
          {loading ? 'Checking...' : 'Log in with API key'}
        </button>
      </div>
    </form>
  );
}
