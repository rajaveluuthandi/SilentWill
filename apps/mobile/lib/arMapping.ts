import type { Asset, AssetCategory } from '@silentwill/api';
import { CATEGORY_INFO } from '../data/mock';
import type { ARVaultItem, ARVaultKind } from '../modules/ar-vault';

/**
 * Turns holdings into AR geometry inputs.
 *
 * The visual metaphor per category — gold accumulates as bars, land spreads as
 * area, insurance encloses as a dome, everything else rises as a tower.
 */
const KIND_BY_CATEGORY: Record<AssetCategory, ARVaultKind> = {
  gold: 'gold',
  'real-estate': 'land',
  insurance: 'shield',
  banking: 'tower',
  'government-funds': 'tower',
  stocks: 'tower',
  'mutual-funds': 'tower',
  cash: 'tower',
  digital: 'tower',
  // Present for exhaustiveness only — liabilities are filtered out below,
  // because a debt is not a holding you can stand a tower on.
  liabilities: 'tower',
};

export interface ARCategoryTotal {
  category: AssetCategory;
  label: string;
  value: number;
  count: number;
}

/** Asset-holding categories only, largest first. */
export function arCategoryTotals(assets: Asset[]): ARCategoryTotal[] {
  const totals = new Map<AssetCategory, { value: number; count: number }>();

  for (const asset of assets) {
    if (asset.value <= 0 || asset.category === 'liabilities') continue;
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
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Normalise against the LARGEST category, not an absolute rupee scale.
 *
 * An absolute mapping is the trap here: at any scale that makes ₹1.17 Cr of
 * real estate a sensible table-top height, ₹2 L of cash is sub-millimetre and
 * invisible. Max-normalising keeps every holding present and comparable, at the
 * cost of the scene showing proportion rather than absolute wealth — which is
 * the honest trade for a spatial view. `minHeight` in the native view keeps the
 * smallest holding visible.
 *
 * @param limit caps the scene; more than ~8 columns stops reading as a group.
 */
export function toARItems(assets: Asset[], limit = 8): ARVaultItem[] {
  const totals = arCategoryTotals(assets).slice(0, limit);
  const max = totals.reduce((m, t) => Math.max(m, t.value), 0);
  if (max <= 0) return [];

  return totals.map((total) => ({
    id: total.category,
    label: total.label,
    magnitude: total.value / max,
    kind: KIND_BY_CATEGORY[total.category] ?? 'tower',
  }));
}
