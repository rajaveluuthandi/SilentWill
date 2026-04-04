import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

const variantStyles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  h2: { fontSize: 24, fontWeight: '600', color: '#111827' },
  h3: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  body: { fontSize: 16, color: '#374151' },
  caption: { fontSize: 14, color: '#6B7280' },
});

export function Text({ children, variant = 'body', className }: TextProps) {
  return (
    <RNText className={className} style={variantStyles[variant]}>
      {children}
    </RNText>
  );
}
