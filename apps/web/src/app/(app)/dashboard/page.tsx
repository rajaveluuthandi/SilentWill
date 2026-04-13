'use client';

import Link from 'next/link';
import {
  MOCK_ASSETS,
  MOCK_NOMINEES,
  MOCK_ACTIVITY,
  getNetWorth,
  formatCurrency,
  getCategoryCounts,
} from '@/data/mock';

const PORTFOLIO_ITEMS = [
  { key: 'banking', label: 'Bank Accounts', icon: '🏦' },
  { key: 'insurance', label: 'Insurance', icon: '🛡' },
  { key: 'government-funds', label: 'Provident Fund', icon: '🏛' },
  { key: 'stocks', label: 'Stocks & MF', icon: '📈' },
  { key: 'gold', label: 'Gold & Precious', icon: '🪙' },
  { key: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { key: 'liabilities', label: 'Liabilities', icon: '📉' },
] as const;

export default function DashboardPage() {
  const netWorth = getNetWorth();
  const counts = getCategoryCounts();
  const verifiedNominees = MOCK_NOMINEES.filter((n) => n.status === 'verified').length;

  const getCategoryValue = (key: string) => {
    return MOCK_ASSETS.filter((a) => a.category === key).reduce((s, a) => s + a.value, 0);
  };

  return (
    <div>
      {/* Top Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Total Value */}
        <div className="col-span-2 bg-surface-container-lowest rounded-xl p-6">
          <p className="text-xs text-on-surface-variant tracking-widest uppercase mb-2 font-inter">
            Total Managed Asset Value
          </p>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-manrope font-bold text-on-surface">
              {formatCurrency(netWorth)}
            </h2>
            <span className="flex items-center gap-1 text-status-secure text-sm font-medium bg-status-secure/10 px-2 py-1 rounded-full">
              ↗ +12.4%
            </span>
          </div>
        </div>

        {/* Inheritance Health */}
        <div className="bg-vault-dark rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <svg className="w-8 h-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs bg-status-secure/30 text-status-secure px-2 py-1 rounded-full font-semibold tracking-wider uppercase">
              Heartbeat Active
            </span>
          </div>
          <h3 className="text-lg font-manrope font-bold mb-1">Inheritance Health</h3>
          <p className="text-sm text-white/70 mb-4">
            Last verification: 4 hours ago. Nominees are assigned at the vault level.
          </p>
          <Link
            href="/nominees"
            className="block w-full text-center py-2.5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Manage Nominees
          </Link>
        </div>
      </div>

      {/* Asset Portfolio */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-manrope font-bold text-on-surface">Asset Portfolio</h3>
          <Link href="/assets" className="text-sm text-primary font-medium hover:underline">
            View Detailed Report →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {PORTFOLIO_ITEMS.map((item) => {
            const value = getCategoryValue(item.key);
            const count = counts[item.key] || 0;
            return (
              <Link
                key={item.key}
                href="/assets"
                className="bg-surface-container-lowest rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-inter">
                  {item.label}
                </p>
                <p className="text-lg font-manrope font-bold text-on-surface">
                  {formatCurrency(value)}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {count} {count === 1 ? 'item' : 'items'}
                </p>
              </Link>
            );
          })}
          <Link
            href="/assets/add"
            className="bg-surface-container-lowest rounded-xl p-5 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-2 text-on-surface-variant text-xl">
              +
            </div>
            <p className="text-sm text-on-surface-variant font-medium">New Category</p>
          </Link>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2">
          <h3 className="text-lg font-manrope font-bold text-on-surface mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {MOCK_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 bg-surface-container-lowest rounded-xl p-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">{activity.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Status: Success. Heartbeat signal updated.
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider shrink-0">
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Overview */}
        <div>
          <h3 className="text-lg font-manrope font-bold text-on-surface mb-4">Security Overview</h3>
          <div className="bg-surface-container-lowest rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider">Vault Encryption</span>
              <span className="text-xs font-bold text-primary bg-primary-container/40 px-2 py-1 rounded">AES-256</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider">Nominee Protocol</span>
              <span className="text-xs font-bold text-primary bg-primary-container/40 px-2 py-1 rounded">Vault-Wide</span>
            </div>
            <p className="text-xs text-on-surface-variant italic leading-4">
              SilentWill uses bank-grade security and full hidden mode to ensure your data is only ever seen by you and your intended heirs.
            </p>
            <button className="w-full py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Download Vault Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
