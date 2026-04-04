import React from 'react';
import { TouchableOpacity, Text as RNText, StyleSheet } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

const variantColors = {
  primary: { bg: '#4F46E5', text: '#FFFFFF' },
  secondary: { bg: '#E5E7EB', text: '#111827' },
  outline: { bg: 'transparent', text: '#4F46E5' },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  className,
}: ButtonProps) {
  const colors = variantColors[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={className}
      style={[
        styles.button,
        { backgroundColor: colors.bg },
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      <RNText style={[styles.text, { color: colors.text }]}>{title}</RNText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
