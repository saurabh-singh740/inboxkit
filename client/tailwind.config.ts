import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0a0f1e',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
          500: '#475569',
          accent: '#6366f1',
          'accent-dim': '#4f46e5',
          'accent-glow': '#818cf8',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Cascadia Code', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(99,102,241,0.4)',
        'glow-md': '0 0 16px rgba(99,102,241,0.5)',
        'glow-lg': '0 0 32px rgba(99,102,241,0.4)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tileFlash: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '40%': { transform: 'scale(1.35)', filter: 'brightness(1.8)', zIndex: '10' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(99,102,241,0.3)' },
          '50%': { boxShadow: '0 0 12px rgba(99,102,241,0.8)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'tile-flash': 'tileFlash 0.45s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
