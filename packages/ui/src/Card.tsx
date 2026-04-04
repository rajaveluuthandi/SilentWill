import React from 'react';
import { cn } from '@silentwill/utils';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6 shadow-sm', className)}>
      {title && <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>}
      {children}
    </div>
  );
}
