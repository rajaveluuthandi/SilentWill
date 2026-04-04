import React from 'react';
import { cn } from '@silentwill/utils';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

const variantElements = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
} as const;

const variantStyles = {
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-2xl font-semibold text-gray-900',
  h3: 'text-xl font-semibold text-gray-800',
  body: 'text-base text-gray-700',
  caption: 'text-sm text-gray-500',
};

export function Text({ children, variant = 'body', className }: TextProps) {
  const Element = variantElements[variant];
  return <Element className={cn(variantStyles[variant], className)}>{children}</Element>;
}
