'use client';

import { useState } from 'react';
import { useActivityLog } from '@/hooks/useSupabaseData';
import type { ActivityLog } from '@/data/mock';

const TYPE_STYLE: Record<
  ActivityLog['type'],
  { bg: string; text: string; ring: string; label: string }
> = {
  secure: { bg: 'bg-status-secure/10', text: 'text-status-secure', ring: 'ring-status-secure/20', label: 'Security' },
  asset: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20', label: 'Asset' },
  legacy: { bg: 'bg-status-pending/10', text: 'text-status-pending', ring: 'ring-status-pending/20', label: 'Legacy' },
  settings: { bg: 'bg-surface-container', text: 'text-on-surface-variant', ring: 'ring-outline-variant', label: 'Settings' },
};

const FILTERS = ['All', 'Security', 'Asset', 'Legacy', 'Settings'] as const;

function IconFor({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, string> = {
    fingerprint: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4',
    bank: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'person-add': 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    'pie-chart': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
    verified: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    diamond: 'M5 3l-2.5 4.5L12 21l9.5-13.5L19 3H5z',
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name] || paths.refresh} />
    </svg>
  );
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const { activity } = useActivityLog();

  const items = activity.filter(
    (a) => filter === 'All' || TYPE_STYLE[a.type as keyof typeof TYPE_STYLE]?.label === filter
  );

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-on-surface mb-2">Recent Activity</h1>
      <p className="text-sm text-on-surface-variant mb-8 max-w-2xl">
        A complete, immutable timeline of every action across your vault — security events, asset
        changes, nominee updates, and configuration changes.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-surface-container-lowest rounded-xl p-6">
        {items.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-8">
            No activity in this category.
          </p>
        ) : (
          <ol className="relative">
            {items.map((item, idx) => {
              const style = TYPE_STYLE[item.type];
              const isLast = idx === items.length - 1;
              return (
                <li key={item.id} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${style.bg} ${style.ring}`}
                    >
                      <IconFor name={item.icon} className={`w-5 h-5 ${style.text}`} />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-outline-variant mt-2" />}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-medium uppercase tracking-wider ${style.text}`}
                      >
                        {style.label}
                      </span>
                      <span className="text-xs text-on-surface-variant">·</span>
                      <span className="text-xs text-on-surface-variant">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
