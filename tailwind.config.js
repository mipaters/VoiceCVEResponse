/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noc: {
          950: '#05080f',
          900: '#0a0f1a',
          800: '#101828',
          700: '#182236',
          600: '#243049',
        },
        accent: { DEFAULT: '#22d3ee', dim: '#0e7490' },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cascadia Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
