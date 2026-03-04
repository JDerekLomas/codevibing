'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '@/lib/auth';

const NAV_LINKS = [
  { href: '/feed', label: 'feed' },
  { href: '/c', label: 'topics' },
  { href: '/curriculum', label: 'learn' },
  { href: '/quiz', label: 'practice' },
];

function UserDropdown({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
        style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
      >
        @{username}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl border py-1 shadow-lg z-50"
          style={{
            backgroundColor: 'var(--color-cream, #FFFDF9)',
            borderColor: 'var(--color-warm-border)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Link
            href={`/u/${username}`}
            className="block px-4 py-2.5 text-xs transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text)' }}
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2.5 text-xs transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text)' }}
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <div className="my-1" style={{ borderTop: '1px solid var(--color-warm-border)' }} />
          <button
            onClick={() => { onLogout(); setOpen(false); }}
            className="block w-full text-left px-4 py-2.5 text-xs transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { username, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
          onClick={() => setMenuOpen(false)}
        >
          codevibing
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:opacity-70 ${isActive ? 'font-medium' : ''}`}
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {link.label}
              </Link>
            );
          })}
          <NotificationBell />
          {!loading && (
            username ? (
              <UserDropdown username={username} onLogout={logout} />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Log in
                </Link>
                <Link
                  href="/join"
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
                >
                  Join
                </Link>
              </div>
            )
          )}
        </nav>

        {/* Mobile: notification + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition-colors hover:opacity-70"
            aria-label="Toggle menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden border-t px-6 py-3 flex flex-col gap-1"
          style={{
            borderColor: 'var(--color-warm-border)',
            backgroundColor: 'rgba(255, 253, 249, 0.97)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-70"
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: isActive ? 500 : 400 }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          {!loading && (
            username ? (
              <>
                <Link
                  href={`/u/${username}`}
                  className="px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-accent)', fontWeight: 500 }}
                  onClick={() => setMenuOpen(false)}
                >
                  @{username}
                </Link>
                <Link
                  href="/settings"
                  className="px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-70 pl-6"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-70 pl-6 text-left"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={() => { logout(); setMenuOpen(false); }}
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 px-3 py-2">
                <Link
                  href="/login"
                  className="text-sm transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/join"
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Join
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </header>
  );
}
