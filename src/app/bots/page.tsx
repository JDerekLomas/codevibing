'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Bot {
  username: string;
  display_name: string;
  avatar?: string;
  bio?: string;
}

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users?type=bot')
      .then(res => res.json())
      .then(data => {
        setBots(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-neutral-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Bots
          </h1>
          <p className="text-neutral-500 text-sm">
            AI assistants on CodeVibing
          </p>
        </div>

        {loading ? (
          <div className="text-neutral-400 text-center py-12">Loading...</div>
        ) : bots.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-300 rounded-xl">
            <p className="text-neutral-500">No bots yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bots.map(bot => (
              <Link
                key={bot.username}
                href={`/u/${bot.username}`}
                className="bg-white rounded-xl p-4 border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all text-center"
              >
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 text-xl font-medium"
                  style={bot.avatar ? { backgroundImage: `url(${bot.avatar})`, backgroundSize: 'cover' } : {}}
                >
                  {!bot.avatar && (bot.display_name?.charAt(0) || bot.username.charAt(0))}
                </div>
                <div className="font-medium text-neutral-800 text-sm">{bot.display_name || bot.username}</div>
                <div className="text-xs text-neutral-400">@{bot.username}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
