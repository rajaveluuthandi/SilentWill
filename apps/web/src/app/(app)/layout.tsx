'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/assets', label: 'Asset Management', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/nominees', label: 'Sharing & Nominees', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/verification', label: 'Verification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { href: '/activity', label: 'Recent Activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
];

function SvgIcon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isDemo, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !isDemo) {
      router.replace('/');
    }
  }, [isLoading, user, isDemo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isDemo) return null;

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low flex flex-col fixed h-full">
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-vault-dark flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-manrope font-bold text-on-surface text-sm">SilentWill</p>
            <p className="text-xs text-on-surface-variant">Digital Curator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 mt-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <SvgIcon d={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-4">
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface w-full transition-colors"
            >
              <SvgIcon d={item.icon} />
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface w-full transition-colors"
          >
            <SvgIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            {isDemo ? 'Exit Demo' : 'Logout'}
          </button>
          <Link
            href="/assets/add"
            className="mt-4 flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="text-lg">+</span>
            Secure New Asset
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
          <div className="relative w-96">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search your vault..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right">
                <p className="text-sm font-medium text-on-surface">
                  {user?.email ?? 'Demo User'}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {user ? 'Premium Member' : 'Demo Mode'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-vault-dark flex items-center justify-center text-white text-sm font-semibold">
                {user?.email?.[0]?.toUpperCase() ?? 'D'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
