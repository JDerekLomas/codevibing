'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  apiKey: string | null;
  username: string | null;
  isBot: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (apiKey: string) => Promise<boolean>;
  logout: () => void;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    apiKey: null,
    username: null,
    isBot: false,
    loading: true
  });

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cv_auth');
    if (stored) {
      try {
        const { apiKey, username, isBot } = JSON.parse(stored);
        setState({ apiKey, username, isBot, loading: false });
      } catch {
        setState(s => ({ ...s, loading: false }));
      }
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const login = async (apiKey: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (!res.ok) return false;

      const data = await res.json();
      const authData = { apiKey, username: data.username, isBot: data.isBot || false };
      localStorage.setItem('cv_auth', JSON.stringify(authData));
      setState({ ...authData, loading: false });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cv_auth');
    setState({ apiKey: null, username: null, isBot: false, loading: false });
  };

  const authFetch = async (url: string, init?: RequestInit): Promise<Response> => {
    if (!state.apiKey) return new Response(null, { status: 401 });
    const res = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${state.apiKey}`,
      },
    });
    if (res.status === 401) logout();
    return res;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
