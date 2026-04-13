'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Mode = 'idle' | 'signIn' | 'signUp';

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && (auth.session || auth.isDemo)) {
      router.push('/dashboard');
    }
  }, [auth.isLoading, auth.session, auth.isDemo, router]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter email and password');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await auth.signIn(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await auth.signUp(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  const handleDemoMode = () => {
    auth.enterDemoMode();
    router.push('/dashboard');
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-vault-dark flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-manrope font-bold text-on-surface tracking-tight mb-3">
            SilentWill
          </h1>
          <p className="text-base text-on-surface-variant">
            Your Digital Inheritance Vault
          </p>
        </div>

        {mode === 'idle' ? (
          <>
            <div className="space-y-3 mb-8">
              <button
                onClick={() => { resetForm(); setMode('signIn'); }}
                className="w-full h-14 rounded-xl bg-primary text-on-primary font-inter font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
              <button
                onClick={() => { resetForm(); setMode('signUp'); }}
                className="w-full h-14 rounded-xl bg-surface-container-lowest text-primary font-inter font-semibold text-base flex items-center justify-center gap-2 border border-outline-variant hover:bg-surface-container transition-colors"
              >
                Sign Up
              </button>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="mx-4 text-on-surface-variant text-sm">or</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <button
              onClick={handleDemoMode}
              className="w-full h-14 rounded-xl bg-vault-dark text-on-primary font-inter font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Try Demo Mode
            </button>

            <p className="text-center text-on-surface-variant text-xs mt-4 leading-5">
              Explore SilentWill with sample data.<br />No account required.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-manrope font-bold text-on-surface text-center mb-6">
              {mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={mode === 'signIn' ? handleSignIn : handleSignUp} className="space-y-3 mb-4">
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 rounded-xl bg-surface-container-lowest border border-outline-variant px-4 text-on-surface text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="password"
                placeholder="Password"
                autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 rounded-xl bg-surface-container-lowest border border-outline-variant px-4 text-on-surface text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {mode === 'signUp' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 rounded-xl bg-surface-container-lowest border border-outline-variant px-4 text-on-surface text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}

              {error && (
                <p className="text-sm text-status-alert text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-primary text-on-primary font-inter font-semibold text-base flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                ) : mode === 'signIn' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <button
              onClick={() => { resetForm(); setMode('idle'); }}
              className="w-full text-center text-primary text-sm font-medium mt-2 hover:underline"
            >
              Back
            </button>
          </>
        )}

        <p className="text-center text-on-surface-variant text-xs mt-16">
          Secured with end-to-end encryption
        </p>
      </div>
    </div>
  );
}
