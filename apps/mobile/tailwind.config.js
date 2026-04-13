/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.native.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Design System: "Digital Curator" palette
        primary: '#4f6073',
        'primary-container': '#c8d6e0',
        secondary: '#49636f',
        'secondary-container': '#d0e0e8',
        tertiary: '#5a7a6b',
        'tertiary-container': '#b8d4c8',
        surface: '#f8f9fa',
        'surface-container': '#eaeff1',
        'surface-container-low': '#f0f3f5',
        'surface-container-high': '#e0e5e8',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#2b3437',
        'on-surface-variant': '#6b7b83',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'outline-variant': '#c0ccd2',
        vault: {
          dark: '#1a2332',
          medium: '#2d3e50',
          light: '#4f6073',
        },
        status: {
          secure: '#2d8a5e',
          pending: '#d4a843',
          alert: '#c45a4a',
        },
      },
      fontFamily: {
        manrope: ['Manrope'],
        'manrope-bold': ['Manrope_700Bold'],
        'manrope-semibold': ['Manrope_600SemiBold'],
        'manrope-medium': ['Manrope_500Medium'],
        inter: ['Inter'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
      borderRadius: {
        'card': '0.75rem',
      },
      spacing: {
        'safe-bottom': '34px',
      },
    },
  },
  plugins: [],
};
