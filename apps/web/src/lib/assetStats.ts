import type { Asset, AssetCategory } from '@silentwill/api';
import { CATEGORY_INFO, formatCurrency } from '@/data/mock';

/**
 * Pure derivations over an Asset[] that the caller already has.
 *
 * Deliberately NOT reusing the getTotalAssetValue/getAssetsByCategory/
 * getCategoryCounts helpers in data/mock.ts -- those read MOCK_ASSETS directly,
 * so they return demo numbers even when real Supabase data is on screen.
 *
 * Only fields that exist in BOTH shapes are touched (value, category, nominee,
 * name). The mock objects are camelCase but are cast to the snake_case runtime
 * Asset type, so created_at / maturity_date read undefined in demo mode.
 */

/** Liabilities are stored as negative values, so "gross" means positives only. */
export function grossAssets(assets: Asset[]): number {
  return assets.reduce((sum, a) => (a.value > 0 ? sum + a.value : sum), 0);
}

/** Stays negative, so it can be summed straight into net worth. */
export function totalLiabilities(assets: Asset[]): number {
  return assets.reduce((sum, a) => (a.value < 0 ? sum + a.value : sum), 0);
}

export function netWorth(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + (a.value ?? 0), 0);
}

export interface CategorySlice {
  category: AssetCategory | 'other';
  label: string;
  value: number;
  count: number;
  /** Fraction of gross assets, 0..1. */
  share: number;
}

/** Asset-holding categories only (liabilities live in the net-worth bridge), desc by value. */
export function byCategory(assets: Asset[]): CategorySlice[] {
  const gross = grossAssets(assets);
  const totals = new Map<AssetCategory, { value: number; count: number }>();

  for (const asset of assets) {
    if (asset.value <= 0) continue;
    const entry = totals.get(asset.category) ?? { value: 0, count: 0 };
    entry.value += asset.value;
    entry.count += 1;
    totals.set(asset.category, entry);
  }

  return [...totals.entries()]
    .map(([category, { value, count }]) => ({
      category,
      label: CATEGORY_INFO[category]?.label ?? category,
      value,
      count,
      share: gross > 0 ? value / gross : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Top `n` categories plus a folded residual. Capped at 4 named slices because
 * the light-mode ordinal ramp only validates to 5 steps and the residual takes
 * one -- and the residual wears a neutral grey rather than a ramp step, since
 * it can be larger than the 4th named category and a ramp step would misstate
 * that.
 */
export function topCategoriesWithOther(assets: Asset[], n = 4): CategorySlice[] {
  const all = byCategory(assets);
  // `<= n`, not `<= n + 1`: there are only n ramp steps, so returning n + 1
  // named slices would paint the last real category with the residual grey and
  // make it look like a fold. Colours must never lie about what they mean.
  if (all.length <= n) return all;

  const head = all.slice(0, n);
  const tail = all.slice(n);

  return [
    ...head,
    {
      category: 'other' as const,
      label: 'Other',
      value: tail.reduce((sum, s) => sum + s.value, 0),
      count: tail.reduce((sum, s) => sum + s.count, 0),
      share: tail.reduce((sum, s) => sum + s.share, 0),
    },
  ];
}

export interface NomineeCoverage {
  coveredValue: number;
  uncoveredValue: number;
  /** Fraction of gross asset value with a nominee named, 0..1. */
  share: number;
  uncoveredCount: number;
  totalCount: number;
}

/** Coverage by VALUE, not by count -- one unassigned house outweighs ten assigned FDs. */
export function nomineeCoverage(assets: Asset[]): NomineeCoverage {
  let coveredValue = 0;
  let uncoveredValue = 0;
  let uncoveredCount = 0;
  let totalCount = 0;

  for (const asset of assets) {
    if (asset.value <= 0) continue;
    totalCount += 1;
    if (asset.nominee && asset.nominee.trim()) {
      coveredValue += asset.value;
    } else {
      uncoveredValue += asset.value;
      uncoveredCount += 1;
    }
  }

  const gross = coveredValue + uncoveredValue;
  return {
    coveredValue,
    uncoveredValue,
    share: gross > 0 ? coveredValue / gross : 0,
    uncoveredCount,
    totalCount,
  };
}

/**
 * formatCurrency returns the absolute value, which is right for the asset table
 * but hides the sign on liabilities. This restores it where the sign is the point.
 */
export function formatSigned(value: number): string {
  return value < 0 ? `−${formatCurrency(value)}` : formatCurrency(value);
}

export function formatShare(share: number): string {
  const pct = share * 100;
  return `${pct < 10 ? pct.toFixed(1) : Math.round(pct)}%`;
}
