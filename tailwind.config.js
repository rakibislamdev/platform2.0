/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          100: '#1a1f2e',
          200: '#151924',
          300: '#0f1318',
          400: '#0a0d12',
          500: '#060810',
        },
        'accent': {
          blue: '#2962ff',
          green: '#00c853',
          red: '#ff5252',
          yellow: '#ffc107',
          purple: '#7c3aed',
        },
        'chart': {
          up: '#26a69a',
          down: '#ef5350',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(41, 98, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(41, 98, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
