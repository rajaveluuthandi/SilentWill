'use client';

import Link from 'next/link';

export default function AuthPage() {
  const handleComingSoon = (feature: string) => {
    alert(`${feature} will be available in the full release.`);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="text-center mb-16">
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

        {/* Auth Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleComingSoon('Sign In')}
            className="w-full h-14 rounded-xl bg-primary text-on-primary font-inter font-semibold text-base opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
          >
            Sign In
          </button>
          <button
            onClick={() => handleComingSoon('Sign Up')}
            className="w-full h-14 rounded-xl bg-surface-container-lowest text-primary font-inter font-semibold text-base opacity-50 cursor-not-allowed flex items-center justify-center gap-2 border border-outline-variant"
          >
            Sign Up
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="mx-4 text-on-surface-variant text-sm">or</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Demo Mode */}
        <Link
          href="/dashboard"
          className="w-full h-14 rounded-xl bg-vault-dark text-on-primary font-inter font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Try Demo Mode
        </Link>

        <p className="text-center text-on-surface-variant text-xs mt-4 leading-5">
          Explore SilentWill with sample data.<br />No account required.
        </p>

        {/* Footer */}
        <p className="text-center text-on-surface-variant text-xs mt-16">
          Secured with end-to-end encryption
        </p>
      </div>
    </div>
  );
}
