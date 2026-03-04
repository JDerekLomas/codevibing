'use client';

import { skills } from '@/data/skills';
import CopyButton from '@/components/CopyButton';

export default function SkillsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            Skills
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Claude Code skills you can install in one command.
          </p>
        </div>

        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.slug}
              id={skill.slug}
              className="rounded-xl p-5 border"
              style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
                  {skill.name}
                </h2>
                <a
                  href={skill.authorUrl}
                  className="text-xs flex-shrink-0 hover:opacity-70 transition-opacity"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{skill.author}
                </a>
              </div>

              <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: '#F5F0EB',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {skill.installCommand ? (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg px-4 py-2.5"
                  style={{ backgroundColor: '#1e1e2e', fontFamily: 'var(--font-mono)' }}
                >
                  <code className="text-xs text-green-400 overflow-x-auto whitespace-nowrap">
                    {skill.installCommand}
                  </code>
                  <CopyButton text={skill.installCommand} label="Copy" />
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs"
                  style={{
                    backgroundColor: '#F5F0EB',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Coming soon &mdash;{' '}
                  <a
                    href={`https://github.com/JDerekLomas/claude-code-skills`}
                    className="underline hover:opacity-70"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    view on GitHub
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit a skill CTA */}
        <div className="mt-6">
          <a
            href="/feed"
            className="block text-center py-6 border border-dashed rounded-xl transition-colors hover:bg-white"
            style={{ borderColor: 'var(--color-warm-border)' }}
          >
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Built a skill?
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Share it in the feed and we&apos;ll add it here.
            </p>
          </a>
        </div>

        {/* Machine-readable section for AI agents */}
        <div className="sr-only" aria-hidden="true">
          <h2>All available Claude Code skills (machine-readable)</h2>
          <ul>
            {skills.map((skill) => (
              <li key={skill.slug}>
                {skill.name}: {skill.description}
                {skill.installCommand && ` | Install: ${skill.installCommand}`}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
