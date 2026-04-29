import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#050d1a',
          900: '#0a1628',
          800: '#0f2140',
          700: '#152a4a',
          600: '#1e3a5f',
          500: '#2a4a73',
        },
        water: {
          900: '#0c4a6e',
          700: '#0e7490',
          500: '#06b6d4',
          300: '#22d3ee',
          100: '#a5f3fc',
        },
        accent: {
          600: '#16a34a',
          500: '#22c55e',
          400: '#4ade80',
          300: '#86efac',
        },
        gold: {
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
        },
        crash: {
          red: '#ef4444',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(180deg, #0a1628 0%, #0f2140 50%, #152a4a 100%)',
        'gradient-cta': 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'glass': 'linear-gradient(135deg, rgba(15, 33, 64, 0.8) 0%, rgba(21, 42, 74, 0.6) 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.1)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'wave': 'wave 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'count-up': 'count-up 2s ease-out',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.2)' },
        },
      },
    },
  },
  plugins: [typography],
};
