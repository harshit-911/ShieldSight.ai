import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1220',
        surface: {
          DEFAULT: '#111827',
          light: '#1F2937',
          dark: '#0D1322',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: 'rgba(37, 99, 235, 0.15)',
        },
        success: {
          DEFAULT: '#22C55E',
          subtle: 'rgba(34, 197, 94, 0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          subtle: 'rgba(245, 158, 11, 0.15)',
        },
        danger: {
          DEFAULT: '#EF4444',
          subtle: 'rgba(239, 68, 68, 0.15)',
        },
        text: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          dark: '#64748B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(37, 99, 235, 0.3)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
