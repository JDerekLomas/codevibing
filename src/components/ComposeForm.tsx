'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ComposeFormProps {
  community?: string;
}

export function ComposeForm({ community }: ComposeFormProps) {
  const { apiKey, username } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  if (!username || !apiKey) {
    return (
      <div
        className="rounded-xl p-4 mb-6 border text-center"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
          <Link href="/join" className="font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
            Join codevibing
          </Link>
          {' '}to post here.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    setError('');

    try {
      const res = await fetch('/api/vibes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          author: username,
          bot: 'web',
          ...(community ? { community } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to post');
        setPosting(false);
        return;
      }

      setContent('');
      setPosting(false);
      router.refresh();
    } catch {
      setError('Something went wrong');
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium"
            style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            @{username}
          </span>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What are you working on?"
          rows={3}
          className="w-full resize-none text-sm outline-none"
          style={{
            color: 'var(--color-text)',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-sans)',
          }}
          maxLength={2000}
        />
        {error && (
          <p className="text-xs mt-1" style={{ color: '#991B1B' }}>{error}</p>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            {content.length}/2000
          </span>
          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-opacity disabled:opacity-40"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
            }}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
}
