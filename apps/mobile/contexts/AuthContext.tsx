import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase, isBackendConfigured } from '../lib/supabase';
import { clearAllData } from '../lib/database';
import type { Session, User } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

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
  // Seeded on the FIRST render, not in an effect: app/index.tsx redirects on
  // `session || isDemo`, so deferring this would flash the auth screen.
  const [isDemo, setIsDemo] = useState(!isBackendConfigured);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // No backend: nothing to restore, nothing to subscribe to. A faked listener
    // would be worse — the cleanup below unsubscribes it.
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

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
    const redirectTo = makeRedirectUri();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') {
        const url = new URL(result.url);
        const params = new URLSearchParams(url.hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        }
      }
    }
  }, []);

  const signOutFn = useCallback(async () => {
    // clearAllData still runs with no backend — the local SQLite cache is
    // independent of Supabase, and leaving decrypted rows behind on sign-out
    // would defeat the point of clearing.
    if (supabase) await supabase.auth.signOut();
    await clearAllData();
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
