import React from 'react';
import { cn } from '@silentwill/utils';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

/**
 * Cross-platform Button component.
 * On web: renders an HTML <button>.
 * On native: import Button from '@silentwill/ui/native' instead.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  className,
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none';
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  };
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], disabled && disabledStyles, className)}
    >
      {title}
    </button>
  );
}
