import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-container': 'var(--color-primary-container)',
        secondary: 'var(--color-secondary)',
        'secondary-container': 'var(--color-secondary-container)',
        tertiary: 'var(--color-tertiary)',
        'tertiary-container': 'var(--color-tertiary-container)',
        surface: 'var(--color-surface)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'on-primary': 'var(--color-on-primary)',
        'outline-variant': 'var(--color-outline-variant)',
        vault: {
          dark: 'var(--color-vault-dark)',
          medium: 'var(--color-vault-medium)',
          light: 'var(--color-vault-light)',
        },
        status: {
          secure: 'var(--color-status-secure)',
          pending: 'var(--color-status-pending)',
          alert: 'var(--color-status-alert)',
        },
        chart: {
          surface: 'var(--chart-surface)',
          'share-1': 'var(--chart-share-1)',
          'share-2': 'var(--chart-share-2)',
          'share-3': 'var(--chart-share-3)',
          'share-4': 'var(--chart-share-4)',
          'share-other': 'var(--chart-share-other)',
          accent: 'var(--chart-accent)',
          negative: 'var(--chart-negative)',
          track: 'var(--chart-track)',
        },
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
