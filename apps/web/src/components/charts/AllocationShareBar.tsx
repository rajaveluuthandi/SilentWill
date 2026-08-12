'use client';

import { useState } from 'react';
import { formatCurrency } from '@/hooks/useSupabaseData';
import { formatShare, type CategorySlice } from '@/lib/assetStats';
import { ChartCard } from './ChartCard';
import { ChartTooltip, TooltipRow, TooltipTitle } from './ChartTooltip';
import { DataTableView } from './DataTableView';

/**
 * The ordinal ramp, largest first. Capped at four steps: the light-mode ramp
 * fails its light-end contrast floor at six, and the residual takes a slot.
 * The residual wears a NEUTRAL grey rather than a ramp step -- it can be larger
 * than the 4th named category, so a ramp step would misstate its size.
 */
const SHARE_COLORS = [
  'var(--chart-share-1)',
  'var(--chart-share-2)',
  'var(--chart-share-3)',
  'var(--chart-share-4)',
];
const OTHER_COLOR = 'var(--chart-share-other)';

function colorFor(slice: CategorySlice, index: number): string {
  if (slice.category === 'other') return OTHER_COLOR;
  return SHARE_COLORS[index] ?? OTHER_COLOR;
}

interface AllocationShareBarProps {
  slices: CategorySlice[];
}

export function AllocationShareBar({ slices }: AllocationShareBarProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // No in-segment labels: the fills are CSS variables, so the white-or-ink
  // choice cannot be made from their luminance, and share-4 gives white text
  // only 2.99:1 while dark mode's share-1 would swallow it entirely. The legend
  // below carries every label, amount and share instead.

  // Running offsets, used to centre the tooltip over the hovered segment.
  let cumulative = 0;
  const centres = slices.map((slice) => {
    const centre = cumulative + slice.share / 2;
    cumulative += slice.share;
    return centre;
  });

  const active = hovered !== null ? slices[hovered] : null;

  return (
    <ChartCard
      title="Portfolio allocation"
      subtitle="Share of gross assets by category"
      footnote="Top 4 categories by value; the rest are folded into Other, which is shown in neutral grey because it can outweigh the 4th named category. Liabilities are excluded — a debt has no share of what you own."
      tableView={
        <DataTableView
          labelHeader="Category"
          valueHeader="Value"
          metaHeader="Share"
          rows={slices.map((slice, i) => ({
            label: slice.category === 'other' ? `Other (${slice.count} assets)` : slice.label,
            value: formatCurrency(slice.value),
            meta: formatShare(slice.share),
            swatch: colorFor(slice, i),
          }))}
        />
      }
    >
      <div className="relative">
        {/* 2px gaps in the card surface do the separating -- no strokes on marks. */}
        <div className="flex gap-[2px] h-7 w-full" role="presentation">
          {slices.map((slice, i) => (
            <div
              key={slice.category}
              tabIndex={0}
              role="img"
              aria-label={`${slice.label}: ${formatCurrency(slice.value)}, ${formatShare(
                slice.share,
              )} of gross assets, ${slice.count} ${slice.count === 1 ? 'asset' : 'assets'}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              style={{ flexBasis: `${slice.share * 100}%`, background: colorFor(slice, i) }}
              className={`relative shrink grow-0 min-w-[3px] outline-none
                          focus-visible:ring-2 focus-visible:ring-primary
                          ${i === 0 ? 'rounded-l' : ''} ${
                            i === slices.length - 1 ? 'rounded-r' : ''
                          }`}
            />
          ))}
        </div>

        {active && hovered !== null && (
          // Below the bar: the bar sits just under the card header, so an
          // above-placed tooltip escapes the top of the card.
          <ChartTooltip x={`${centres[hovered] * 100}%`} y="28px" placement="below">
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

      {/* Legend is always present for 2+ series -- identity never rests on colour alone. */}
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
        {slices.map((slice, i) => (
          <li key={slice.category} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: colorFor(slice, i) }}
            />
            <span className="text-xs text-on-surface">{slice.label}</span>
            <span className="text-xs text-on-surface-variant tabular-nums">
              {formatCurrency(slice.value)} · {formatShare(slice.share)}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
