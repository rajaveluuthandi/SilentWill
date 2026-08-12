'use client';

import { useState } from 'react';
import { formatCurrency } from '@/hooks/useSupabaseData';
import { formatShare, type CategorySlice } from '@/lib/assetStats';
import { ChartCard } from './ChartCard';
import { ChartTooltip, TooltipRow, TooltipTitle } from './ChartTooltip';
import { DataTableView } from './DataTableView';

interface RankedCategoryBarsProps {
  categories: CategorySlice[];
}

export function RankedCategoryBars({ categories }: RankedCategoryBarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Scale to the largest CATEGORY, not the portfolio total, so the small
  // categories stay readable instead of collapsing to slivers.
  const max = categories.reduce((m, c) => Math.max(m, c.value), 0);
  const active = hovered !== null ? categories[hovered] : null;

  return (
    <ChartCard
      title="Where your wealth sits"
      subtitle="Every asset category, largest first"
      footnote="Bars are scaled to the largest category, not to the portfolio total. Liabilities are shown separately."
      tableView={
        <DataTableView
          labelHeader="Category"
          valueHeader="Value"
          metaHeader="Assets"
          rows={categories.map((c) => ({
            label: c.label,
            value: formatCurrency(c.value),
            meta: String(c.count),
          }))}
        />
      }
    >
      {/* One series, one colour. Colouring bars darker-where-longer would
          double-encode the length that the bar already shows. Single series, so
          no legend -- the card title names what is plotted. */}
      <div className="relative">
        <ul>
          {categories.map((category, i) => (
            <li
              key={category.category}
              tabIndex={0}
              role="img"
              aria-label={`${category.label}: ${formatCurrency(category.value)}, ${formatShare(
                category.share,
              )} of gross assets, ${category.count} ${category.count === 1 ? 'asset' : 'assets'}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="grid grid-cols-[minmax(0,6.5rem)_1fr_auto] items-center gap-3 h-8 px-1 -mx-1
                         rounded outline-none focus-visible:ring-2 focus-visible:ring-primary
                         hover:bg-surface-container-low focus-visible:bg-surface-container-low"
            >
              <span className="text-xs text-on-surface truncate" title={category.label}>
                {category.label}
              </span>
              {/* 14px bar in a 32px band: the leftover is air, never filled. */}
              <span className="block h-3.5 w-full">
                <span
                  className="block h-full rounded-r-[4px] bg-chart-accent motion-safe:transition-[width] motion-safe:duration-300"
                  style={{ width: max > 0 ? `${Math.max((category.value / max) * 100, 1)}%` : '0%' }}
                />
              </span>
              <span className="text-xs text-right tabular-nums whitespace-nowrap">
                <span className="font-medium text-on-surface">{formatCurrency(category.value)}</span>
                <span className="text-on-surface-variant"> · {formatShare(category.share)}</span>
              </span>
            </li>
          ))}
        </ul>

        {active && hovered !== null && (
          <ChartTooltip
            x="50%"
            // Sit on whichever side keeps the tooltip inside the card, and never
            // over the row being read.
            y={hovered === 0 ? '32px' : `${hovered * 32}px`}
            placement={hovered === 0 ? 'below' : 'above'}
          >
            <TooltipTitle>{active.label}</TooltipTitle>
            <TooltipRow label="Value" value={formatCurrency(active.value)} />
            <TooltipRow label="Share" value={formatShare(active.share)} />
            <TooltipRow
              label="Assets"
              value={`${active.count} ${active.count === 1 ? 'entry' : 'entries'}`}
            />
          </ChartTooltip>
        )}
      </div>
    </ChartCard>
  );
}
