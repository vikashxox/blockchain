/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF5',
          100: '#FFF8E7',
          200: '#FAF3E0',
          300: '#F0E6D0',
          400: '#E5D8BE',
        },
        ivory: '#FFFDF9',
        govNavy: {
          DEFAULT: '#1B3A6B',
          dark: '#122648',
          light: '#254E8E',
          soft: '#EAF0F9',
        },
        govSaffron: {
          DEFAULT: '#E8832A',
          dark: '#C86815',
          light: '#F8A155',
          soft: '#FFF2E5',
        },
        govGreen: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50',
          soft: '#E8F5E9',
        },
        charcoal: {
          DEFAULT: '#1F2A44',
          muted: '#4A5568',
          light: '#718096',
        },
        warmBorder: '#E3DAC9',
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'Merriweather', 'Georgia', 'serif'],
        sans: ['"Noto Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
