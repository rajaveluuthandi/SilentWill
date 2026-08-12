'use client';

import Link from 'next/link';
import { formatCurrency } from '@/hooks/useSupabaseData';
import { formatShare, type NomineeCoverage } from '@/lib/assetStats';
import { ChartCard } from './ChartCard';
import { DataTableView } from './DataTableView';

/**
 * Severity levels. Because these are status colours they must never carry the
 * meaning alone -- each ships with an icon and a text label.
 */
const WARNING_ICON =
  'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';

/**
 * The track is a lighter step of the FILL's own ramp, not a fixed blue -- state
 * has to read across the whole bar, and a blue track under a red fill puts two
 * unrelated hues in one mark. Mixed toward the card surface so the lighter step
 * lands correctly in both themes.
 */
const LEVELS = [
  {
    min: 0.8,
    label: 'Well covered',
    color: 'var(--chart-accent)',
    track: 'var(--chart-track)',
    tone: 'text-on-surface',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    min: 0.5,
    label: 'Partially covered',
    color: 'var(--color-status-pending)',
    track: 'color-mix(in srgb, var(--color-status-pending) 24%, var(--chart-surface))',
    tone: 'text-status-pending',
    icon: WARNING_ICON,
  },
  {
    min: 0,
    label: 'Needs attention',
    color: 'var(--color-status-alert)',
    track: 'color-mix(in srgb, var(--color-status-alert) 24%, var(--chart-surface))',
    tone: 'text-status-alert',
    icon: WARNING_ICON,
  },
];

interface NomineeCoverageMeterProps {
  coverage: NomineeCoverage;
}

/**
 * A single ratio against a limit is a meter, not a two-slice pie. Measured by
 * VALUE rather than by count -- one unassigned house outweighs ten assigned FDs.
 */
export function NomineeCoverageMeter({ coverage }: NomineeCoverageMeterProps) {
  const { coveredValue, uncoveredValue, share, uncoveredCount, totalCount } = coverage;
  const level = LEVELS.find((l) => share >= l.min) ?? LEVELS[LEVELS.length - 1];
  const gross = coveredValue + uncoveredValue;

  return (
    <ChartCard
      title="Nominee coverage"
      subtitle="Share of asset value with a nominee named"
      footnote="Measured by value, not by asset count — an unassigned property matters more than an unassigned savings account."
      tableView={
        <DataTableView
          labelHeader="Status"
          valueHeader="Value"
          metaHeader="Assets"
          rows={[
            {
              label: 'Nominee named',
              value: formatCurrency(coveredValue),
              meta: String(totalCount - uncoveredCount),
              swatch: level.color,
            },
            {
              label: 'No nominee',
              value: formatCurrency(uncoveredValue),
              meta: String(uncoveredCount),
              swatch: level.track,
            },
          ]}
          total={{ label: 'Gross assets', value: formatCurrency(gross), meta: String(totalCount) }}
        />
      }
    >
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <p className="text-3xl font-manrope font-bold text-on-surface">{formatShare(share)}</p>
        {/* Icon + label, so the severity never rests on the colour. */}
        <p className={`flex items-center gap-1.5 text-xs font-medium ${level.tone}`}>
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={level.icon} />
          </svg>
          {level.label}
        </p>
      </div>

      {/* Track is a lighter step of the fill's own ramp, so state reads across
          the whole bar rather than only where it is filled. */}
      <div
        role="img"
        aria-label={`${formatShare(share)} of asset value has a nominee named: ${formatCurrency(
          coveredValue,
        )} of ${formatCurrency(gross)}`}
        className="h-3 w-full rounded-full overflow-hidden"
        style={{ background: level.track }}
      >
        <div
          className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${Math.max(share * 100, 1.5)}%`, background: level.color }}
        />
      </div>

      <p className="text-xs text-on-surface-variant mt-3">
        {formatCurrency(coveredValue)} of {formatCurrency(gross)} covered
        {uncoveredCount > 0 && (
          <>
            {' · '}
            <span className="text-on-surface font-medium">
              {uncoveredCount} {uncoveredCount === 1 ? 'asset has' : 'assets have'} no nominee
            </span>
          </>
        )}
      </p>

      <Link
        href="/nominees"
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-2"
      >
        Assign nominees
        <span aria-hidden="true">→</span>
      </Link>
    </ChartCard>
  );
}
