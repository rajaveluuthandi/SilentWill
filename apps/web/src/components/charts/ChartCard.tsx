'use client';

import { useId, useState, type ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Caveats about what the chart does and does not include. Always rendered. */
  footnote?: string;
  /** The chart itself. */
  children: ReactNode;
  /**
   * The WCAG-clean twin. Every value in the chart must be reachable here, so a
   * tooltip is never the only way to read a number.
   */
  tableView: ReactNode;
  className?: string;
}

/**
 * Card shell for a chart. Height is never fixed -- a fixed height that excludes
 * the label band produces a nested scrollbar inside the card.
 */
export function ChartCard({
  title,
  subtitle,
  footnote,
  children,
  tableView,
  className = '',
}: ChartCardProps) {
  const [asTable, setAsTable] = useState(false);
  const bodyId = useId();

  return (
    <section className={`bg-surface-container-lowest rounded-xl p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="text-sm font-manrope font-semibold text-on-surface">{title}</h2>
          {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        <div
          role="group"
          aria-label={`${title}: view as`}
          className="flex items-center gap-0.5 shrink-0 bg-surface-container rounded-lg p-0.5"
        >
          <ViewToggleButton
            active={!asTable}
            onClick={() => setAsTable(false)}
            label="Chart"
            controls={bodyId}
          >
            <path strokeLinecap="round" d="M4 19V10m5 9V5m5 14v-7m5 7V8" />
          </ViewToggleButton>
          <ViewToggleButton
            active={asTable}
            onClick={() => setAsTable(true)}
            label="Table"
            controls={bodyId}
          >
            <path strokeLinecap="round" d="M4 9h16M4 15h16M10 5v14" />
            <rect x="4" y="5" width="16" height="14" rx="1.5" />
          </ViewToggleButton>
        </div>
      </div>

      <div id={bodyId}>{asTable ? tableView : children}</div>

      {footnote && (
        <p className="text-[11px] leading-relaxed text-on-surface-variant mt-4">{footnote}</p>
      )}
    </section>
  );
}

function ViewToggleButton({
  active,
  onClick,
  label,
  controls,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  controls: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-controls={controls}
      title={`View as ${label.toLowerCase()}`}
      className={`w-7 h-7 rounded-md flex items-center justify-center motion-safe:transition-colors ${
        active
          ? 'bg-surface-container-lowest text-on-surface shadow-sm'
          : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        {children}
      </svg>
      <span className="sr-only">View as {label.toLowerCase()}</span>
    </button>
  );
}
