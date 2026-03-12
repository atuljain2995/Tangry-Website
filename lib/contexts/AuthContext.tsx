'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AuthProfile = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

type AuthState = {
  user: AuthProfile | null;
  profile: AuthProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    // If /api/auth/me hangs, show login/signup UI after 3s so the icon stays usable
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    const { signOut: signOutAction } = await import('@/lib/actions/auth');
    await signOutAction();
    setProfile(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        profile,
        loading,
        signOut,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
