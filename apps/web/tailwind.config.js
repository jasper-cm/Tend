/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', '../../libs/ui/src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Core garden palette — warm greens and earth tones
        soil: {
          DEFAULT: '#3d2e1f',
          light: '#5c4033',
        },
        leaf: {
          DEFAULT: '#4a7c59',
          light: '#6b9e7a',
          dark: '#2f5738',
        },
        moss: '#7a8b5c',
        fern: '#5a7247',
        sage: '#87a878',
        bark: {
          DEFAULT: '#8b7355',
          light: '#a99276',
        },
        bloom: '#c27ba0',
        water: '#6b9daa',
        sun: {
          DEFAULT: '#d4a843',
          light: '#e8c86a',
        },
        terracotta: '#c07850',
        parchment: '#f5f0e8',
        cream: '#faf6ee',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
