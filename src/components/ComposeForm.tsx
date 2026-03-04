'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ComposeFormProps {
  community?: string;
}

const COMMON_TOOLS = ['Claude Code', 'Next.js', 'React', 'Supabase', 'Tailwind', 'Three.js', 'Python', 'TypeScript'];

export function ComposeForm({ community }: ComposeFormProps) {
  const { apiKey, username } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [buildLog, setBuildLog] = useState(false);
  const [buildTitle, setBuildTitle] = useState('');
  const [buildTools, setBuildTools] = useState<string[]>([]);
  const [buildLink, setBuildLink] = useState('');
  const [buildScreenshot, setBuildScreenshot] = useState('');

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

  const toggleTool = (tool: string) => {
    setBuildTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (buildLog && !buildTitle.trim()) return;

    setPosting(true);
    setError('');

    try {
      const body: Record<string, unknown> = {
        content: content.trim(),
        author: username,
        bot: 'web',
        ...(community ? { community } : {}),
      };

      if (buildLog) {
        body.metadata = {
          type: 'build_log',
          title: buildTitle.trim(),
          tools: buildTools.length > 0 ? buildTools : undefined,
          link: buildLink.trim() || undefined,
          screenshot: buildScreenshot.trim() || undefined,
        };
      }

      const res = await fetch('/api/vibes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to post');
        setPosting(false);
        return;
      }

      setContent('');
      setBuildLog(false);
      setBuildTitle('');
      setBuildTools([]);
      setBuildLink('');
      setBuildScreenshot('');
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
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
          <button
            type="button"
            onClick={() => setBuildLog(!buildLog)}
            className="text-[10px] px-2 py-1 rounded-full border transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              borderColor: buildLog ? 'var(--color-accent)' : 'var(--color-warm-border)',
              backgroundColor: buildLog ? 'var(--color-accent)' : 'transparent',
              color: buildLog ? 'white' : 'var(--color-text-muted)',
            }}
          >
            Build Log
          </button>
        </div>

        {buildLog && (
          <div className="space-y-3 mb-3">
            <input
              value={buildTitle}
              onChange={e => setBuildTitle(e.target.value)}
              placeholder="What did you build?"
              className="w-full text-sm outline-none rounded-lg border px-3 py-2"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-warm-border)',
                backgroundColor: 'var(--color-cream)',
                fontFamily: 'var(--font-sans)',
              }}
              maxLength={100}
            />
            <div>
              <div className="text-[10px] mb-1.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Tools used
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_TOOLS.map(tool => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className="text-[10px] px-2 py-0.5 rounded-full border transition-colors"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      borderColor: buildTools.includes(tool) ? 'var(--color-accent)' : 'var(--color-warm-border)',
                      backgroundColor: buildTools.includes(tool) ? 'var(--color-accent)' : 'transparent',
                      color: buildTools.includes(tool) ? 'white' : 'var(--color-text-muted)',
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={buildLink}
              onChange={e => setBuildLink(e.target.value)}
              placeholder="Link to project (optional)"
              className="w-full text-xs outline-none rounded-lg border px-3 py-2"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-warm-border)',
                backgroundColor: 'var(--color-cream)',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <input
              value={buildScreenshot}
              onChange={e => setBuildScreenshot(e.target.value)}
              placeholder="Screenshot URL (optional)"
              className="w-full text-xs outline-none rounded-lg border px-3 py-2"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-warm-border)',
                backgroundColor: 'var(--color-cream)',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>
        )}

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={buildLog ? "What did you learn? Tell the story..." : "What are you working on?"}
          rows={buildLog ? 4 : 3}
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
            disabled={posting || !content.trim() || (buildLog && !buildTitle.trim())}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-opacity disabled:opacity-40"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
            }}
          >
            {posting ? 'Posting...' : (buildLog ? 'Share Build' : 'Post')}
          </button>
        </div>
      </div>
    </form>
  );
}
