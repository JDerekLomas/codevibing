'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export function InlineJoinForm() {
  const { login, username: loggedInUser, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ username: string; apiKey: string } | null>(null);

  // Already logged in
  if (authLoading) return null;

  if (loggedInUser) {
    return (
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
            style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
          >
            {loggedInUser.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Welcome back, @{loggedInUser}
            </div>
            <div className="flex gap-3 mt-1">
              <Link href={`/u/${loggedInUser}`} className="text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                Your profile
              </Link>
              <Link href="/c" className="text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                Communities
              </Link>
              <Link href="/feed" className="text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">&#127881;</div>
          <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            You&apos;re in! Welcome, @{success.username}
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Your API key has been saved. Visit your profile to start customizing.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href={`/u/${success.username}`}
              className="text-xs px-4 py-2 rounded-lg transition-colors"
              style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              Set up your profile
            </Link>
            <Link
              href="/c"
              className="text-xs px-4 py-2 rounded-lg border transition-colors hover:bg-[#F5F0EB]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
            >
              Explore communities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, ...(email && { email }) })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not claim username');
        setLoading(false);
        return;
      }

      // Create profile
      await fetch(`/api/users/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.api_key}`
        },
        body: JSON.stringify({
          displayName: username,
          bio: 'Just joined codevibing',
          mood: 'excited'
        })
      });

      // Auto-login
      await login(data.api_key);
      setSuccess({ username, apiKey: data.api_key });
    } catch {
      setError('Something went wrong. Try again?');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          Pick a username — you&apos;re in
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>@</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="yourname"
              className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-[#92400E] min-w-0"
              style={{
                fontFamily: 'var(--font-mono)',
                borderColor: 'var(--color-warm-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-cream)',
              }}
              maxLength={20}
              minLength={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading || username.length < 3}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40 flex-shrink-0"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email (optional, for account recovery)"
          className="w-full mt-2 px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:border-[#92400E]"
          style={{
            fontFamily: 'var(--font-mono)',
            borderColor: 'var(--color-warm-border)',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-cream)',
          }}
        />
        {error && (
          <p className="text-xs mt-2" style={{ color: '#991B1B' }}>{error}</p>
        )}
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          No password, no credit card. Just a username.
        </p>
      </div>
    </form>
  );
}
