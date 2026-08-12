'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAssets, useNominees, formatCurrency } from '@/hooks/useSupabaseData';
import { CATEGORY_INFO, type AssetCategory } from '@/data/mock';
import { PortfolioInsights } from '@/components/charts/PortfolioInsights';
import { formatSigned, netWorth as computeNetWorth, totalLiabilities } from '@/lib/assetStats';

const FILTER_TABS: { key: AssetCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Assets' },
  { key: 'real-estate', label: 'Real Estate' },
  { key: 'banking', label: 'Banking' },
  { key: 'gold', label: 'Gold' },
  { key: 'insurance', label: 'Policies' },
  { key: 'stocks', label: 'Stocks' },
  { key: 'cash', label: 'Cash' },
];

/**
 * Category badges are deliberately neutral. They used to be coloured by
 * asset.status while displaying the category label, so the colour encoded one
 * thing and the text another -- and those raw palette classes never adapted to
 * dark mode. Liabilities keep a tint because "this row is a debt" is real
 * meaning, not decoration.
 *
 * The tint uses color-mix rather than a `/10` opacity modifier: Tailwind cannot
 * apply an alpha channel to a bare var() colour, so it silently drops those
 * utilities and the background would come out transparent.
 */
function categoryBadgeStyle(category: AssetCategory) {
  return category === 'liabilities'
    ? {
        className: 'text-status-alert',
        style: {
          background: 'color-mix(in srgb, var(--color-status-alert) 14%, var(--chart-surface))',
        },
      }
    : { className: 'bg-surface-container text-on-surface-variant', style: undefined };
}

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState<AssetCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const { assets, loading } = useAssets();
  const { nominees } = useNominees();

  const netWorth = computeNetWorth(assets);
  const liabilities = totalLiabilities(assets);

  const filtered = assets.filter((a) => {
    const matchesFilter = activeFilter === 'all' || a.category === activeFilter;
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
        <span>SilentWill</span>
        <span>›</span>
        <span className="text-primary font-medium">Asset Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-on-surface">Your Assets</h1>
          <p className="text-sm text-on-surface-variant mt-1">Cataloged and secure wealth management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <Link
            href="/assets/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            + Add Asset
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-5">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Total Portfolio</p>
          <p className="text-2xl font-manrope font-bold text-on-surface">{formatCurrency(netWorth)}</p>
          <p className="text-xs text-on-surface-variant mt-1">
            {liabilities < 0 ? `Net of ${formatSigned(liabilities)} liabilities` : 'No liabilities recorded'}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Beneficiaries</p>
          <p className="text-2xl font-manrope font-bold text-on-surface">{nominees.length}</p>
          <p className="text-xs text-on-surface-variant mt-1">Assigned to assets</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-status-secure" />
            <p className="text-2xl font-manrope font-bold text-on-surface">Active</p>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">Verified 14h ago</p>
        </div>
        {/* on-primary rather than white: in dark mode bg-primary is #a8bcd0, where
            white text sits at ~1.7:1. The 88% itself is still hardcoded. */}
        <div className="bg-primary rounded-xl p-5">
          <p className="text-xs text-on-primary opacity-70 uppercase tracking-wider mb-1">
            Readiness Score
          </p>
          <p className="text-3xl font-manrope font-bold text-on-primary">88%</p>
        </div>
      </div>

      {/* Portfolio insights — above the tab row, so the tabs scope only the table */}
      <PortfolioInsights assets={assets} />

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-48">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter..."
            className="w-full h-9 pl-3 pr-3 rounded-lg bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-container">
              <th className="text-left px-6 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Asset Name</th>
              <th className="text-left px-6 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Category</th>
              <th className="text-right px-6 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Value</th>
              <th className="text-right px-6 py-3 text-xs text-on-surface-variant uppercase tracking-wider font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => {
              const info = CATEGORY_INFO[asset.category];
              const badge = categoryBadgeStyle(asset.category);
              return (
                <tr key={asset.id} className="border-b border-surface-container last:border-0 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-primary">
                        {asset.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">{asset.name}</p>
                        <p className="text-xs text-on-surface-variant">{asset.subcategory}{asset.institution ? ` • ${asset.institution}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wider ${badge.className}`}
                      style={badge.style}
                    >
                      {info.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-on-surface">{formatCurrency(asset.value)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-on-surface">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-on-surface-variant">
        <p>Showing {filtered.length} of {assets.length} assets</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container">&lt;</button>
          <button className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center text-sm font-medium">1</button>
          <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container">2</button>
          <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container">&gt;</button>
        </div>
      </div>
    </div>
  );
}
