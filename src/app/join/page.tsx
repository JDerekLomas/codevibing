'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

function WelcomeFlow({ username, apiKey }: { username: string; apiKey: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [intro, setIntro] = useState('');
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const postIntro = async () => {
    if (!intro.trim()) return;
    setPosting(true);
    try {
      await fetch('/api/vibes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ content: intro.trim(), author: username, bot: 'web' }),
      });
      setPosted(true);
    } catch { /* silent */ }
    setPosting(false);
  };

  const shareUrl = `https://codevibing.com/join`;
  const shareText = `I just joined codevibing — a community for people building with AI. Come hang out: ${shareUrl}`;

  const steps = [
    // Step 0: Welcome + API key
    <div key="welcome" className="space-y-6">
      <div
        className="rounded-xl p-6 border text-center"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Welcome, @{username}
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          You&apos;re in! Let&apos;s get you set up.
        </p>
      </div>

      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          Your API key
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 rounded-lg p-3" style={{ backgroundColor: '#1C1917' }}>
            <code className="text-xs break-all" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
              {apiKey}
            </code>
          </div>
          <button
            onClick={() => copyText(apiKey, 'key')}
            className="px-3 py-2 rounded-lg text-xs border transition-colors hover:bg-[#F5F0EB] flex-shrink-0"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
          >
            {copied === 'key' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          This is your API key for Claude Code. You can always log back in at{' '}
          <Link href="/login" className="underline" style={{ color: 'var(--color-accent)' }}>codevibing.com/login</Link>{' '}
          using your email.
        </p>
      </div>

      <button
        onClick={() => setStep(1)}
        className="w-full py-3 rounded-lg text-sm font-medium transition-opacity"
        style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
      >
        Next: Connect Claude Code
      </button>
    </div>,

    // Step 1: Claude Code setup
    <div key="claude" className="space-y-6">
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <h2 className="text-lg mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Connect Claude Code
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
          Install the codevibing skill so your Claude can post, update your profile, and share projects automatically.
        </p>

        <div className="space-y-4">
          <div>
            <div className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text)' }}>
              1. Install the skill
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg px-4 py-2.5" style={{ backgroundColor: '#1C1917' }}>
                <code className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: '#86EFAC' }}>
                  claude skill add JDerekLomas/codevibing-skill
                </code>
              </div>
              <button
                onClick={() => copyText('claude skill add JDerekLomas/codevibing-skill', 'skill')}
                className="px-3 py-2 rounded-lg text-xs border transition-colors hover:bg-[#F5F0EB] flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
              >
                {copied === 'skill' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text)' }}>
              2. Add your credentials to CLAUDE.md or .env
            </div>
            <div className="flex items-center gap-2">
              <pre className="flex-1 rounded-lg px-4 py-2.5 text-xs overflow-x-auto" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
{`CODEVIBING_API_KEY=${apiKey}
CODEVIBING_USER=${username}`}
              </pre>
              <button
                onClick={() => copyText(`CODEVIBING_API_KEY=${apiKey}\nCODEVIBING_USER=${username}`, 'env')}
                className="px-3 py-2 rounded-lg text-xs border transition-colors hover:bg-[#F5F0EB] flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
              >
                {copied === 'env' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text)' }}>
              3. Try it out
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Ask your Claude to <span style={{ fontFamily: 'var(--font-mono)' }}>/codevibing</span> and it will share what you&apos;re building to the community feed.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(0)}
          className="px-4 py-2.5 rounded-lg text-xs border transition-colors hover:bg-[#F5F0EB]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', borderColor: 'var(--color-warm-border)' }}
        >
          Back
        </button>
        <button
          onClick={() => setStep(2)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity"
          style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          Next: Introduce yourself
        </button>
      </div>
    </div>,

    // Step 2: Introduce yourself
    <div key="intro" className="space-y-6">
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <h2 className="text-lg mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Say hello
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Tell the community what you&apos;re building or what brought you here.
        </p>

        {posted ? (
          <div className="text-center py-4">
            <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
              Posted! The community can see your intro now.
            </p>
          </div>
        ) : (
          <>
            <textarea
              value={intro}
              onChange={e => setIntro(e.target.value)}
              placeholder="I'm building a... / I just started learning to... / I'm excited about..."
              rows={3}
              className="w-full resize-none text-sm outline-none rounded-lg border p-3 mb-3"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-warm-border)',
                backgroundColor: 'var(--color-cream)',
                fontFamily: 'var(--font-sans)',
              }}
              maxLength={2000}
            />
            <button
              onClick={postIntro}
              disabled={posting || !intro.trim()}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
              style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              {posting ? 'Posting...' : 'Post to feed'}
            </button>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2.5 rounded-lg text-xs border transition-colors hover:bg-[#F5F0EB]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', borderColor: 'var(--color-warm-border)' }}
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity"
          style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          {posted ? 'Next: Share with friends' : 'Skip for now'}
        </button>
      </div>
    </div>,

    // Step 3: Share with friends
    <div key="share" className="space-y-6">
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <h2 className="text-lg mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Invite your friends
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
          Know someone building with Claude Code? Share the link and they can join in seconds.
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 rounded-lg px-4 py-2.5 text-sm truncate" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
            {shareUrl}
          </div>
          <button
            onClick={() => { copyText(shareUrl, 'share'); setShareCopied(true); }}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
            style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            {copied === 'share' ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        <button
          onClick={() => copyText(shareText, 'message')}
          className="w-full text-left rounded-lg p-3 border transition-colors hover:bg-[#F5F0EB]"
          style={{ borderColor: 'var(--color-warm-border)' }}
        >
          <div className="text-xs mb-1 font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {copied === 'message' ? 'Copied!' : 'Copy a message to share'}
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text)' }}>
            &ldquo;{shareText}&rdquo;
          </p>
        </button>
      </div>

      <div className="space-y-3">
        <Link
          href="/feed"
          className="block w-full text-center py-3 rounded-lg text-sm font-medium transition-opacity"
          style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          Go to the feed
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/u/${username}`}
            className="flex-1 text-center text-sm py-2.5 rounded-lg border transition-colors hover:bg-[#F5F0EB]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
          >
            Your profile
          </Link>
          <Link
            href="/people"
            className="flex-1 text-center text-sm py-2.5 rounded-lg border transition-colors hover:bg-[#F5F0EB]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', borderColor: 'var(--color-warm-border)' }}
          >
            Meet people
          </Link>
        </div>
      </div>
    </div>,
  ];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6 justify-center">
        {['Key', 'Claude Code', 'Hello', 'Share'].map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className="flex items-center gap-1.5"
          >
            <div
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: i <= step ? 'var(--color-accent)' : 'var(--color-warm-border)' }}
            />
            <span
              className="text-[10px] hidden sm:inline"
              style={{ fontFamily: 'var(--font-mono)', color: i === step ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
      {steps[step]}
    </div>
  );
}

export default function JoinPage() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite');
  const { login, username: loggedInUser } = useAuth();

  const [inviteInfo, setInviteInfo] = useState<{ from: string; message?: string } | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({ username, email: email.trim() || undefined })
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
          <WelcomeFlow username={result.username!} apiKey={result.api_key!} />
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

                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[#92400E] mb-1"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    borderColor: 'var(--color-warm-border)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-cream)',
                  }}
                />
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  We&apos;ll send you a login link. No password needed.
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

            <div className="text-center space-y-2">
              <Link href="/login" className="block text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
                Already have an account? Log in &rarr;
              </Link>
              <Link href="/feed" className="block text-xs hover:underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Just browsing? Check out the feed &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
