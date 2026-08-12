'use client';

import { formatSigned } from '@/lib/assetStats';
import { ChartCard } from './ChartCard';
import { DataTableView } from './DataTableView';

interface NetWorthBridgeProps {
  gross: number;
  /** Negative. */
  liabilities: number;
  net: number;
}

/**
 * Three marks on ONE shared linear scale anchored at a neutral zero rule.
 * Never a second axis: assets and liabilities are the same unit, so they belong
 * on the same scale, where the debt can be seen against what it offsets.
 */
export function NetWorthBridge({ gross, liabilities, net }: NetWorthBridgeProps) {
  const negativeExtent = Math.abs(Math.min(liabilities, net, 0));
  const positiveExtent = Math.max(gross, net, 0);
  const span = negativeExtent + positiveExtent || 1;
  const zero = (negativeExtent / span) * 100;

  const components = [
    { label: 'Assets', value: gross, color: 'var(--chart-accent)' },
    { label: 'Liabilities', value: liabilities, color: 'var(--chart-negative)' },
  ];

  return (
    <ChartCard
      title="What you actually own"
      subtitle="Gross assets against what is owed"
      footnote="Liabilities are stored as negative values, so the headline portfolio figure already nets them out. This shows the gross and the debt separately."
      tableView={
        <DataTableView
          labelHeader="Component"
          valueHeader="Value"
          rows={components.map((row) => ({
            label: row.label,
            value: formatSigned(row.value),
            swatch: row.color,
          }))}
          total={{ label: 'Net worth', value: formatSigned(net) }}
        />
      }
    >
      <ul>
        {components.map((row) => (
          <BridgeRow key={row.label} {...row} zero={zero} span={span} />
        ))}
      </ul>

      <ul className="border-t border-outline-variant mt-1 pt-1">
        <BridgeRow
          label="Net worth"
          value={net}
          color="var(--chart-accent)"
          zero={zero}
          span={span}
          emphasis
        />
      </ul>

      {/* Two series, so a legend is present. */}
      <ul className="flex items-center gap-5 mt-3">
        {components.map((row) => (
          <li key={row.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: row.color }}
            />
            <span className="text-xs text-on-surface-variant">{row.label}</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

function BridgeRow({
  label,
  value,
  color,
  zero,
  span,
  emphasis = false,
}: {
  label: string;
  value: number;
  color: string;
  zero: number;
  span: number;
  emphasis?: boolean;
}) {
  const width = (Math.abs(value) / span) * 100;
  const negative = value < 0;

  return (
    <li className="grid grid-cols-[minmax(0,5rem)_1fr_auto] items-center gap-3">
      <span className={`text-xs truncate ${emphasis ? 'font-semibold text-on-surface' : 'text-on-surface'}`}>
        {label}
      </span>

      <span className="relative block h-8">
        {/* Neutral zero rule -- the midpoint of a diverging scale must read as "nothing". */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-outline-variant"
          style={{ left: `${zero}%` }}
        />
        {/* 14px bar, data-end rounded, square where it meets the zero baseline. */}
        <span
          role="img"
          aria-label={`${label}: ${formatSigned(value)}`}
          className={`absolute top-1/2 -translate-y-1/2 h-3.5 ${
            negative ? 'rounded-l-[4px]' : 'rounded-r-[4px]'
          }`}
          style={{
            background: color,
            width: `${Math.max(width, 0.5)}%`,
            left: negative ? `${zero - width}%` : `${zero}%`,
          }}
        />
      </span>

      <span
        className={`w-[5.5rem] text-xs text-right tabular-nums ${
          emphasis ? 'font-semibold text-on-surface' : 'font-medium text-on-surface'
        }`}
      >
        {formatSigned(value)}
      </span>
    </li>
  );
}
