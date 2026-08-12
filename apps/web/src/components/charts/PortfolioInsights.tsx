'use client';

import type { Asset } from '@silentwill/api';
import {
  byCategory,
  grossAssets,
  netWorth,
  nomineeCoverage,
  topCategoriesWithOther,
  totalLiabilities,
} from '@/lib/assetStats';
import { AllocationShareBar } from './AllocationShareBar';
import { NetWorthBridge } from './NetWorthBridge';
import { NomineeCoverageMeter } from './NomineeCoverageMeter';
import { RankedCategoryBars } from './RankedCategoryBars';

interface PortfolioInsightsProps {
  assets: Asset[];
}

/**
 * Portfolio-level insight band. Deliberately mounted ABOVE the category tab
 * row: the tabs scope only the table, so filtering to a single category can
 * never reduce these charts to a single bar.
 *
 * Takes assets as a prop rather than calling useAssets() itself -- each call to
 * that hook fires its own fetch and vault-key derivation.
 */
export function PortfolioInsights({ assets }: PortfolioInsightsProps) {
  if (assets.length === 0) return null;

  const gross = grossAssets(assets);
  const liabilities = totalLiabilities(assets);
  const net = netWorth(assets);
  const categories = byCategory(assets);
  const slices = topCategoriesWithOther(assets);
  const coverage = nomineeCoverage(assets);

  return (
    /* Left column answers "where is the money"; right column answers "is this
       ready to be inherited". items-start so cards size to their content -- and
       the two columns come out within ~20px of each other, so neither stretches
       into dead space. */
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start mb-6">
      <div className="xl:col-span-7 flex flex-col gap-4">
        <AllocationShareBar slices={slices} />
        <RankedCategoryBars categories={categories} />
      </div>
      <div className="xl:col-span-5 flex flex-col gap-4">
        <NetWorthBridge gross={gross} liabilities={liabilities} net={net} />
        <NomineeCoverageMeter coverage={coverage} />
      </div>
    </div>
  );
}
