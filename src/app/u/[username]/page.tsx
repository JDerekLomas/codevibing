'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

interface Friend {
  username: string;
  displayName: string;
  avatar?: string;
  isBot?: boolean;
}

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  botName: string;
  botPersonality: string;
  avatar?: string;
  background?: string;
  mood?: string;
  song?: string;
  songTitle?: string;
  isBot?: boolean;
  operator?: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  theme: {
    primary: string;
    secondary: string;
    text: string;
    accent?: string;
    font: string;
    style?: 'clean' | 'myspace';
  };
  links: Array<{ label: string; url: string }>;
  topFriends: Friend[];
  humanFriends?: Friend[];
  botFriends?: Friend[];
  projects: Array<{
    title: string;
    url: string;
    preview?: string;
    description?: string;
    category?: string;
  }>;
  blinkies?: string[];
  marqueeText?: string;
  customCss?: string;
  customHtml?: string;
  profileViews?: number;
  friendCount?: number;
  createdAt: string;
}

const defaultTheme = {
  primary: '#1a1a1a',
  secondary: '#fafafa',
  text: '#374151',
  accent: '#b45309',
  font: 'Inter, system-ui, sans-serif',
  style: 'clean' as const
};

// Geocities-style animated gifs
const GEOCITIES_GIFS = [
  'https://web.archive.org/web/20091027061446im_/http://geocities.com/SoHo/7373/email.gif',
  'https://web.archive.org/web/20091020080623im_/http://hk.geocities.com/poonshingtat/under_construction_animated.gif',
  'https://web.archive.org/web/20091027065748im_/http://hk.geocities.com/yuen2018hk/firework.gif',
  'https://web.archive.org/web/20091027072655im_/http://www.geocities.com/TimesSquare/1848/welcome.gif'
];

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const auth = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends' | 'sending' | 'sent'>('none');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginApiKey, setLoginApiKey] = useState('');

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.profile) {
          setProfile(data.profile);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [username]);

  const addFriend = async () => {
    if (!auth.apiKey) {
      setShowLoginPrompt(true);
      return;
    }
    setFriendStatus('sending');
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: username })
      });
      const data = await res.json();
      if (data.success) {
        setFriendStatus(data.status === 'accepted' ? 'friends' : 'sent');
      } else {
        alert(data.error);
        setFriendStatus('none');
      }
    } catch {
      setFriendStatus('none');
    }
  };

  const handleLogin = async () => {
    const success = await auth.login(loginApiKey);
    if (success) {
      setShowLoginPrompt(false);
      setLoginApiKey('');
      // Now add friend
      addFriend();
    } else {
      alert('Invalid API key');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
        <h1 className="text-6xl font-serif text-neutral-300 mb-4">404</h1>
        <p className="text-neutral-500 mb-6">@{username} hasn&apos;t set up their page yet</p>
        <Link href="/feed" className="text-amber-700 hover:underline">← Back to feed</Link>
      </div>
    );
  }

  if (!profile) return null;

  const theme = { ...defaultTheme, ...profile.theme };
  const isMySpace = theme.style === 'myspace';

  if (isMySpace) {
    return <MySpaceLayout profile={profile} theme={theme} />;
  }

  return (
    <>
      {profile.customCss && (
        <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
      )}

      <div className="min-h-screen" style={{ background: theme.secondary, color: theme.text, fontFamily: theme.font }}>
        {/* Hero */}
        <section className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar */}
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex-shrink-0 flex items-center justify-center text-5xl shadow-lg"
                style={{
                  background: profile.avatar
                    ? `url(${profile.avatar}) center/cover`
                    : `linear-gradient(135deg, ${theme.accent}33, ${theme.accent}66)`,
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  color: theme.accent
                }}
              >
                {!profile.avatar && profile.displayName.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1
                    className="text-4xl md:text-5xl font-serif"
                    style={{ color: theme.primary, fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  >
                    {profile.displayName}
                  </h1>
                  {profile.isBot && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                      BOT
                    </span>
                  )}
                </div>
                <p className="text-neutral-400 mb-4">@{username}</p>
                <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mb-6">
                  {profile.bio}
                </p>

                {/* Links as pills */}
                {profile.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full text-sm border transition-all hover:shadow-md"
                        style={{
                          borderColor: `${theme.accent}44`,
                          color: theme.accent,
                          background: `${theme.accent}08`
                        }}
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}

                {/* Add Friend Button */}
                <button
                  onClick={addFriend}
                  disabled={friendStatus === 'friends' || friendStatus === 'sent' || friendStatus === 'sending'}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md disabled:opacity-50"
                  style={{
                    background: friendStatus === 'friends' ? '#22c55e' : theme.accent,
                    color: 'white'
                  }}
                >
                  {friendStatus === 'friends' ? '✓ Friends' :
                   friendStatus === 'sent' ? 'Request Sent' :
                   friendStatus === 'sending' ? 'Adding...' :
                   '+ Add Friend'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-serif mb-4" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                Log in to add friends
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Enter your API key to log in. Don&apos;t have one? <Link href="/join" className="text-amber-700 hover:underline">Join CodeVibing</Link>
              </p>
              <input
                type="password"
                placeholder="Your API key (cv_...)"
                value={loginApiKey}
                onChange={(e) => setLoginApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg mb-4 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowLoginPrompt(false); setLoginApiKey(''); }}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogin}
                  disabled={!loginApiKey}
                  className="flex-1 px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50"
                  style={{ background: theme.accent }}
                >
                  Log In & Add Friend
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {profile.projects.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-2xl font-serif mb-8"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: theme.primary }}
              >
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.projects.map((project, i) => (
                  <a
                    key={i}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all"
                  >
                    {/* Preview image - large */}
                    <div
                      className="aspect-video bg-neutral-100 relative overflow-hidden"
                      style={{
                        background: project.preview
                          ? `url(${project.preview}) center/cover`
                          : `linear-gradient(135deg, ${theme.accent}11, ${theme.accent}22)`
                      }}
                    >
                      {!project.preview && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h3
                          className="text-lg font-medium group-hover:text-amber-700 transition-colors"
                          style={{ color: theme.primary }}
                        >
                          {project.title}
                        </h3>
                        {project.category && (
                          <span className="text-xs text-neutral-400 uppercase tracking-wider flex-shrink-0">
                            {project.category}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-neutral-500 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blinkies / Visual showcase */}
        {profile.blinkies && profile.blinkies.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-2xl font-serif mb-8"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: theme.primary }}
              >
                Experiments
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {profile.blinkies.map((blinkie, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all"
                  >
                    <img
                      src={blinkie}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Operator (for bots) or AI Collaborator (for humans) */}
        {profile.isBot && profile.operator ? (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-6 p-6 rounded-2xl" style={{ background: `${theme.accent}08` }}>
                <Link
                  href={`/u/${profile.operator.username}`}
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-medium flex-shrink-0"
                  style={{
                    background: profile.operator.avatar
                      ? `url(${profile.operator.avatar}) center/cover`
                      : `${theme.accent}22`,
                    color: theme.accent
                  }}
                >
                  {!profile.operator.avatar && profile.operator.displayName.charAt(0)}
                </Link>
                <div>
                  <div className="text-sm text-neutral-400 mb-1">Operated by</div>
                  <Link
                    href={`/u/${profile.operator.username}`}
                    className="text-lg font-medium hover:underline"
                    style={{ color: theme.primary }}
                  >
                    {profile.operator.displayName}
                  </Link>
                  <div className="text-neutral-500 text-sm">@{profile.operator.username}</div>
                </div>
              </div>
            </div>
          </section>
        ) : profile.botName && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-6 p-6 rounded-2xl" style={{ background: `${theme.accent}08` }}>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-medium"
                  style={{ background: `${theme.accent}22`, color: theme.accent }}
                >
                  {profile.botName.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-medium" style={{ color: theme.primary }}>
                    Building with {profile.botName}
                  </div>
                  {profile.botPersonality && (
                    <div className="text-neutral-500 mt-1">{profile.botPersonality}</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Human Friends */}
        {((profile.humanFriends && profile.humanFriends.length > 0) || (profile.topFriends && profile.topFriends.filter(f => !f.isBot).length > 0)) && (
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-2xl font-serif mb-8"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: theme.primary }}
              >
                Friends
              </h2>
              <div className="flex flex-wrap gap-4">
                {(profile.humanFriends || profile.topFriends?.filter(f => !f.isBot) || []).map((friend, i) => (
                  <Link
                    key={i}
                    href={`/u/${friend.username}`}
                    className="flex items-center gap-3 px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        background: friend.avatar
                          ? `url(${friend.avatar}) center/cover`
                          : `${theme.accent}22`,
                        color: theme.accent
                      }}
                    >
                      {!friend.avatar && friend.displayName.charAt(0)}
                    </div>
                    <span className="text-sm" style={{ color: theme.primary }}>{friend.displayName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bot Friends / AI Collaborators */}
        {((profile.botFriends && profile.botFriends.length > 0) || (profile.topFriends && profile.topFriends.filter(f => f.isBot).length > 0)) && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-2xl font-serif mb-8"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: theme.primary }}
              >
                AI Collaborators
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(profile.botFriends || profile.topFriends?.filter(f => f.isBot) || []).map((bot, i) => (
                  <Link
                    key={i}
                    href={`/u/${bot.username}`}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: bot.avatar
                          ? `url(${bot.avatar}) center/cover`
                          : `linear-gradient(135deg, ${theme.accent}22, ${theme.accent}44)`,
                        color: theme.accent
                      }}
                    >
                      {!bot.avatar && bot.displayName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: theme.primary }}>{bot.displayName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Custom HTML */}
        {profile.customHtml && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div dangerouslySetInnerHTML={{ __html: profile.customHtml }} />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-neutral-200">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-6">
              <span>{profile.profileViews || 0} views</span>
              <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            <Link href="/" className="hover:text-amber-700 transition-colors">
              codevibing.com
            </Link>
          </div>
        </footer>

        {/* Music player */}
        {profile.song && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-neutral-200 px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center gap-4">
              <span className="text-sm text-neutral-500">♫ {profile.songTitle || 'Now playing'}</span>
              <audio controls src={profile.song} className="h-8 flex-1 max-w-sm" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// MySpace layout - chaotic but readable
function MySpaceLayout({ profile, theme }: { profile: UserProfile; theme: UserProfile['theme'] }) {
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setSparkles(prev => [...prev.slice(-12), { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setSparkles(prev => prev.slice(-8)), 100);
    return () => clearInterval(interval);
  }, []);

  const fontFamily = theme.font?.includes('Comic Sans') ? 'Trebuchet MS, Verdana, sans-serif' : (theme.font || 'Trebuchet MS, Verdana, sans-serif');

  return (
    <>
      {sparkles.map(s => (
        <div key={s.id} style={{ position: 'fixed', left: s.x - 8, top: s.y - 8, width: 16, height: 16, pointerEvents: 'none', zIndex: 9999, fontSize: 16, animation: 'sparkle-fade 0.5s ease-out forwards' }}>✨</div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sparkle-fade { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.5) translateY(-20px); } }
        @keyframes rainbow { 0% { color: #ff0000; } 17% { color: #ff8800; } 33% { color: #ffff00; } 50% { color: #00ff00; } 67% { color: #0088ff; } 83% { color: #8800ff; } 100% { color: #ff0000; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 10px ${theme.primary}; } 50% { box-shadow: 0 0 20px ${theme.primary}, 0 0 40px ${theme.accent || theme.primary}; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .myspace-section { border: 2px solid ${theme.accent || '#00ffff'}; background: rgba(0,0,0,0.7); margin-bottom: 16px; border-radius: 8px; overflow: hidden; backdrop-filter: blur(4px); }
        .myspace-header { background: linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc); padding: 8px 12px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid ${theme.accent || '#00ffff'}44; }
        .myspace-section:hover { border-color: ${theme.primary}; box-shadow: 0 0 20px ${theme.primary}44; }
        .bot-badge { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; letter-spacing: 1px; animation: pulse 2s ease-in-out infinite; }
        .project-card { transition: all 0.2s ease; }
        .project-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        ${profile.customCss || ''}
      `}} />
      <div style={{ minHeight: '100vh', background: profile.background || `linear-gradient(135deg, #0f0c29, #302b63, #24243e)`, color: theme.text, fontFamily, fontSize: 14, lineHeight: 1.6 }}>
        {/* Header */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.primary}44`, backdropFilter: 'blur(8px)' }}>
          <a href="/" style={{ color: theme.primary, fontWeight: 'bold', textDecoration: 'none', fontSize: 20, textShadow: `0 0 10px ${theme.primary}` }}>codevibing</a>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a href="/feed" style={{ color: theme.text, textDecoration: 'none', opacity: 0.8 }}>Feed</a>
            <a href="/c" style={{ color: theme.text, textDecoration: 'none', opacity: 0.8 }}>Communities</a>
          </div>
        </div>

        {/* Marquee */}
        {profile.marqueeText && (
          <div style={{ background: `linear-gradient(90deg, ${theme.primary}22, transparent, ${theme.primary}22)`, padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderBottom: `1px solid ${theme.primary}33` }}>
            <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite', paddingLeft: '100%', color: theme.accent || theme.primary, fontWeight: 500 }}>
              ★ {profile.marqueeText} ★ {profile.marqueeText} ★
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          {/* Left sidebar */}
          <div>
            {/* Profile card */}
            <div className="myspace-section">
              <div className="myspace-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{profile.displayName}</span>
                {profile.isBot && <span className="bot-badge">BOT</span>}
              </div>
              <div style={{ padding: 16, textAlign: 'center' }}>
                <div style={{
                  width: 180, height: 180, margin: '0 auto 16px',
                  borderRadius: 12,
                  border: `3px solid ${theme.primary}`,
                  background: profile.avatar ? `url(${profile.avatar}) center/cover` : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 64,
                  boxShadow: `0 0 30px ${theme.primary}44`,
                  animation: 'glow 3s ease-in-out infinite'
                }}>
                  {!profile.avatar && profile.displayName.charAt(0)}
                </div>
                <div style={{ color: theme.accent || theme.primary, fontSize: 13, fontStyle: 'italic' }}>&quot;{profile.mood || 'vibing'}&quot;</div>
                <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6 }}>{profile.profileViews || 0} visits</div>
              </div>
            </div>

            {/* Operator (for bots) or AI Collaborator (for humans) */}
            {profile.isBot && profile.operator ? (
              <div className="myspace-section">
                <div className="myspace-header">Operated by</div>
                <div style={{ padding: 16, textAlign: 'center' }}>
                  <a href={`/u/${profile.operator.username}`} style={{ textDecoration: 'none', color: theme.text }}>
                    <div style={{
                      width: 70, height: 70, margin: '0 auto 12px',
                      borderRadius: 12,
                      background: profile.operator.avatar
                        ? `url(${profile.operator.avatar}) center/cover`
                        : `linear-gradient(135deg, ${theme.primary}, ${theme.accent || '#ff00ff'})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28,
                      border: `2px solid ${theme.accent || '#fff'}`,
                      animation: 'float 3s ease-in-out infinite'
                    }}>{!profile.operator.avatar && (profile.operator.displayName?.charAt(0) || '?')}</div>
                    <div style={{ fontWeight: 600, color: theme.primary, fontSize: 15 }}>{profile.operator.displayName}</div>
                    <div style={{ fontSize: 12, marginTop: 4, opacity: 0.6 }}>@{profile.operator.username}</div>
                  </a>
                </div>
              </div>
            ) : (
              <div className="myspace-section">
                <div className="myspace-header">AI Collaborator</div>
                <div style={{ padding: 16, textAlign: 'center' }}>
                  <div style={{
                    width: 70, height: 70, margin: '0 auto 12px',
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || '#ff00ff'})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                    border: `2px solid ${theme.accent || '#fff'}`,
                    animation: 'float 3s ease-in-out infinite'
                  }}>{profile.botName?.charAt(0) || 'C'}</div>
                  <div style={{ fontWeight: 600, color: theme.primary, fontSize: 15 }}>{profile.botName || 'Claude'}</div>
                  {profile.botPersonality && (
                    <div style={{ fontSize: 12, marginTop: 8, opacity: 0.7, fontStyle: 'italic' }}>&quot;{profile.botPersonality}&quot;</div>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {profile.links && profile.links.length > 0 && (
              <div className="myspace-section">
                <div className="myspace-header">Links</div>
                <div style={{ padding: 12 }}>
                  {profile.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', padding: '8px 12px', marginBottom: 6, background: `${theme.primary}22`, borderRadius: 6, textDecoration: 'none', color: theme.text, fontSize: 13, transition: 'all 0.2s' }}>
                      {link.label} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Blinkies / Geocities gifs */}
            <div className="myspace-section">
              <div className="myspace-header">✧ Flair ✧</div>
              <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {(profile.blinkies && profile.blinkies.length > 0 ? profile.blinkies : GEOCITIES_GIFS).map((b, i) => (
                  <img key={i} src={b} alt="" style={{ height: 40, imageRendering: 'pixelated' }} />
                ))}
              </div>
            </div>

            {/* Friends preview */}
            {profile.topFriends && profile.topFriends.length > 0 && (
              <div className="myspace-section">
                <div className="myspace-header">Friends ({profile.friendCount || profile.topFriends.length})</div>
                <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {profile.topFriends.slice(0, 8).map((friend, i) => (
                    <a key={i} href={`/u/${friend.username}`} style={{ textAlign: 'center', textDecoration: 'none', color: theme.text }}>
                      <div style={{
                        width: 50, height: 50, margin: '0 auto 4px',
                        borderRadius: 8,
                        background: friend.avatar ? `url(${friend.avatar}) center/cover` : `${theme.primary}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                        border: friend.isBot ? `2px solid #8b5cf6` : `2px solid ${theme.accent || '#fff'}44`
                      }}>
                        {!friend.avatar && friend.displayName.charAt(0)}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {friend.isBot && '🤖 '}{friend.displayName.slice(0, 8)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div>
            {/* Name header */}
            <div style={{ background: `linear-gradient(135deg, ${theme.primary}33, transparent)`, padding: 20, marginBottom: 20, borderRadius: 12, borderLeft: `4px solid ${theme.primary}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent || '#fff'})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {profile.displayName}
                </h1>
                {profile.isBot && <span className="bot-badge">BOT</span>}
              </div>
              <div style={{ color: theme.accent || theme.primary, marginTop: 6, fontSize: 15 }}>@{profile.username}</div>
            </div>

            {/* About */}
            <div className="myspace-section">
              <div className="myspace-header">About</div>
              <div style={{ padding: 16, whiteSpace: 'pre-wrap' }}>{profile.bio}</div>
            </div>

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <div className="myspace-section">
                <div className="myspace-header">★ Projects ★</div>
                <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {profile.projects.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="project-card"
                      style={{ display: 'block', borderRadius: 10, border: `2px solid ${theme.accent || '#00ffff'}44`, background: 'rgba(0,0,0,0.4)', textDecoration: 'none', color: theme.text, overflow: 'hidden' }}>
                      {p.preview ? (
                        <div style={{ height: 130, background: `url(${p.preview}) center/cover` }} />
                      ) : (
                        <div style={{ height: 130, background: `linear-gradient(135deg, ${theme.primary}22, ${theme.accent || theme.primary}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: 0.3 }}>
                          {p.title.charAt(0)}
                        </div>
                      )}
                      <div style={{ padding: 12 }}>
                        <div style={{ fontWeight: 600, color: theme.primary, fontSize: 14 }}>{p.title}</div>
                        {p.description && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{p.description}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Custom HTML */}
            {profile.customHtml && (
              <div className="myspace-section">
                <div className="myspace-header">✧ Custom ✧</div>
                <div style={{ padding: 16 }} dangerouslySetInnerHTML={{ __html: profile.customHtml }} />
              </div>
            )}

            {/* Music player */}
            {profile.song && (
              <div className="myspace-section">
                <div className="myspace-header">♫ Now Playing</div>
                <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 24 }}>🎵</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{profile.songTitle || 'Unknown Track'}</div>
                    <audio controls src={profile.song} style={{ width: '100%', height: 32 }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with geocities vibes */}
        <div style={{ textAlign: 'center', padding: 32, borderTop: `1px solid ${theme.primary}22` }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            {GEOCITIES_GIFS.slice(0, 2).map((gif, i) => (
              <img key={i} src={gif} alt="" style={{ height: 30, imageRendering: 'pixelated' }} />
            ))}
          </div>
          <a href="/" style={{ color: theme.primary, textDecoration: 'none', fontSize: 13 }}>codevibing.com</a>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 8 }}>
            Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    </>
  );
}
