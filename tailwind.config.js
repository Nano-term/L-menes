/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Paleta nocturna cozy-cyberpunk
        midnight: {
          50: '#0a0b1e',
          100: '#0c0e24',
          200: '#10142e',
          300: '#161b3a',
          400: '#1d2348',
          500: '#252c58',
        },
        plum: {
          400: '#6d5acd',
          500: '#8b6fe8',
          600: '#a78bfa',
        },
        cyan: {
          glow: '#7ee8fa',
          soft: '#88d3ce',
        },
        rose: {
          glow: '#ffc1d6',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 18s ease infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 40px -10px rgba(126, 232, 250, 0.4)',
        'glow-plum': '0 0 40px -10px rgba(167, 139, 250, 0.4)',
        'card': '0 8px 32px rgba(10, 11, 30, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'card-hover': '0 12px 48px rgba(126, 232, 250, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};
