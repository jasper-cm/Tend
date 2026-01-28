/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', '../../libs/ui/src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        soil: '#44403c',
        leaf: '#65a30d',
        bloom: '#e879f9',
        water: '#38bdf8',
        sun: '#fbbf24',
        bark: '#78716c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
