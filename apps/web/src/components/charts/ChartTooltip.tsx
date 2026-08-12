'use client';

import type { ReactNode } from 'react';

interface ChartTooltipProps {
  /** Horizontal anchor inside the nearest positioned ancestor (any CSS length). */
  x: string;
  /** Vertical anchor inside the nearest positioned ancestor (any CSS length). */
  y: string;
  /**
   * Which side of the anchor to sit on. Flip to 'below' when 'above' would push
   * the tooltip out of the card (e.g. the topmost row of a bar chart).
   */
  placement?: 'above' | 'below';
  children: ReactNode;
}

/**
 * Enhances, never gates -- every value shown here is also in the card's table
 * view. Rendered on focus as well as hover so keyboard reaches the same content.
 */
export function ChartTooltip({ x, y, placement = 'above', children }: ChartTooltipProps) {
  return (
    <div
      role="tooltip"
      style={{ left: x, top: y }}
      className={`absolute z-20 -translate-x-1/2 pointer-events-none whitespace-nowrap rounded-lg
                  bg-surface-container-high text-on-surface ring-1 ring-outline-variant
                  shadow-lg px-3 py-2 ${
                    placement === 'above' ? '-translate-y-full -mt-2' : 'mt-2'
                  }`}
    >
      {children}
    </div>
  );
}

export function TooltipTitle({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold text-on-surface">{children}</p>;
}

export function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[11px] text-on-surface-variant mt-0.5">
      {label} <span className="text-on-surface font-medium tabular-nums">{value}</span>
    </p>
  );
}
