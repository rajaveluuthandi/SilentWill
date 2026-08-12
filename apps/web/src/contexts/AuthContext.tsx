'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isBackendConfigured } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

const NO_BACKEND = 'Backend disabled — running on mock data.';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isDemo: boolean;
  /** False when no Supabase backend is configured; sign-in cannot work. */
  isBackendConfigured: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // Seeded on the FIRST render, not in an effect: the landing page redirects on
  // `session || isDemo`, so deferring this would flash the auth screen before
  // bouncing to the dashboard.
  const [isDemo, setIsDemo] = useState(!isBackendConfigured);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No backend: nothing to restore and nothing to subscribe to. Registering a
    // faked auth listener would be worse — the cleanup below unsubscribes it.
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Bound locally: the narrowing above does not reach inside the nested async
    // closure below.
    const client = supabase;

    const init = async () => {
      // Process OAuth hash tokens before checking session (implicit flow)
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        }
      }
      const { data } = await client.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: NO_BACKEND };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: NO_BACKEND };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signInWithGoogleFn = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  }, []);

  const signOutFn = useCallback(async () => {
    // Still clears isDemo with no backend, so "Exit Demo" keeps working: the
    // layout guard sends you to the landing screen and Try Demo Mode re-enters.
    if (supabase) await supabase.auth.signOut();
    setIsDemo(false);
  }, []);

  const enterDemoMode = useCallback(() => {
    setIsDemo(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isDemo,
        isBackendConfigured,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle: signInWithGoogleFn,
        signOut: signOutFn,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
