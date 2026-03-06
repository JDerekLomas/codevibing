'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  actor: string;
  reference_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

export function NotificationBell() {
  const { apiKey, username, authFetch } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!apiKey) return;
    authFetch('/api/notifications?unread=true')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setNotifications(data.notifications); })
      .catch(() => {});
  }, [apiKey]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    if (!apiKey) return;
    await authFetch('/api/notifications', { method: 'PATCH' });
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  };

  if (!username) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) markAllRead();
        }}
        className="relative p-1 transition-opacity hover:opacity-70"
        title="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ backgroundColor: '#e11d48', color: 'white' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-lg overflow-hidden z-50"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-warm-border)' }}>
            <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] hover:underline"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href={n.type === 'friend_request' ? `/u/${n.actor}` : '/feed'}
                  className="block px-4 py-3 border-b transition-colors hover:bg-[#F5F0EB]"
                  style={{ borderColor: 'var(--color-warm-border)', backgroundColor: n.read ? 'white' : 'rgba(245, 240, 235, 0.5)' }}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-medium mt-0.5"
                      style={{ backgroundColor: '#F5F0EB', color: 'var(--color-accent)' }}
                    >
                      {n.actor?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                        {n.message}
                      </p>
                      <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
