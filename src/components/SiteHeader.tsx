'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotificationBell } from './NotificationBell';

const NAV_LINKS = [
  { href: '/feed', label: 'feed' },
  { href: '/people', label: 'people' },
  { href: '/c', label: 'topics' },
  { href: 'https://learnvibecoding.vercel.app', label: 'learn' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
      style={{ backgroundColor: 'rgba(255, 253, 249, 0.9)', borderColor: 'var(--color-warm-border)' }}
    >
      <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
        >
          codevibing
        </Link>
        <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
          {NAV_LINKS.map((link) => {
            const isActive = link.href.startsWith('/')
              ? pathname === link.href || pathname.startsWith(link.href + '/')
              : false;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:opacity-70 hidden sm:block ${isActive ? 'font-medium' : ''}`}
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {link.label}
              </Link>
            );
          })}
          <NotificationBell />
          <Link
            href="/join"
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
