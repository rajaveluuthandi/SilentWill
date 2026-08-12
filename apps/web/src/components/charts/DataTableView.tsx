'use client';

export interface DataTableRow {
  label: string;
  value: string;
  /** Secondary column, e.g. share or item count. */
  meta?: string;
  /** CSS color of the mark this row corresponds to, so identity survives the flip. */
  swatch?: string;
}

interface DataTableViewProps {
  rows: DataTableRow[];
  labelHeader: string;
  valueHeader: string;
  metaHeader?: string;
  /** Rendered as a final emphasised row (totals, net). */
  total?: DataTableRow;
}

/**
 * The WCAG-clean twin of a chart: no color-only encoding, no hover required.
 * tabular-nums on the numeric columns only -- they align vertically here.
 */
export function DataTableView({
  rows,
  labelHeader,
  valueHeader,
  metaHeader,
  total,
}: DataTableViewProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-surface-container">
          <th className="text-left py-2 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            {labelHeader}
          </th>
          <th className="text-right py-2 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            {valueHeader}
          </th>
          {metaHeader && (
            <th className="text-right py-2 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
              {metaHeader}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-surface-container last:border-0">
            <td className="py-2 text-on-surface">
              <span className="flex items-center gap-2">
                {row.swatch && (
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: row.swatch }}
                  />
                )}
                {row.label}
              </span>
            </td>
            <td className="py-2 text-right font-medium text-on-surface tabular-nums">{row.value}</td>
            {metaHeader && (
              <td className="py-2 text-right text-on-surface-variant tabular-nums">
                {row.meta ?? '—'}
              </td>
            )}
          </tr>
        ))}
      </tbody>
      {total && (
        <tfoot>
          <tr className="border-t border-outline-variant">
            <td className="pt-2 font-semibold text-on-surface">{total.label}</td>
            <td className="pt-2 text-right font-semibold text-on-surface tabular-nums">
              {total.value}
            </td>
            {metaHeader && (
              <td className="pt-2 text-right text-on-surface-variant tabular-nums">
                {total.meta ?? ''}
              </td>
            )}
          </tr>
        </tfoot>
      )}
    </table>
  );
}
