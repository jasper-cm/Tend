/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', '../../libs/ui/src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Spiritual green palette — soft, nurturing, ethereal
        spirit: {
          50: '#f0f7f1',
          100: '#dceedf',
          200: '#bce0c2',
          300: '#8fcc9a',
          400: '#5fb56f',
          500: '#3d9a50',
          600: '#2d7b3e',
          700: '#266234',
          800: '#224e2c',
          900: '#1d4026',
          950: '#0d2314',
        },
        // Sage — calming, meditative
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe4',
          200: '#c9d9cb',
          300: '#a3bda7',
          400: '#7a9d80',
          500: '#5a7f61',
          600: '#46654c',
          700: '#3a513f',
          800: '#314335',
          900: '#2a382d',
          950: '#141e17',
        },
        // Earth — grounding tones
        earth: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e5ddd0',
          300: '#d4c6b0',
          400: '#c0aa8d',
          500: '#b09474',
          600: '#a38263',
          700: '#886a53',
          800: '#705847',
          900: '#5c493c',
          950: '#31261f',
        },
        // Mist — ethereal, dreamy
        mist: {
          50: '#f5f8f7',
          100: '#dee9e6',
          200: '#bdd3cd',
          300: '#94b6ad',
          400: '#6e968b',
          500: '#547a71',
          600: '#42625a',
          700: '#384f49',
          800: '#30413c',
          900: '#2b3834',
          950: '#151f1c',
        },
        // Bloom — heart-centered warmth
        bloom: {
          50: '#fdf4f7',
          100: '#fce8ef',
          200: '#fad5e1',
          300: '#f5b4c9',
          400: '#ed87a8',
          500: '#e15f87',
          600: '#cc3d64',
          700: '#ad2d4e',
          800: '#902841',
          900: '#79263a',
          950: '#450f1d',
        },
        // Golden — illumination, wisdom
        golden: {
          50: '#fefaec',
          100: '#fcf1c9',
          200: '#f9e28e',
          300: '#f5cd53',
          400: '#f2b82b',
          500: '#e99a13',
          600: '#ce750d',
          700: '#ab530f',
          800: '#8b4113',
          900: '#733613',
          950: '#421b06',
        },
        // Water — flow, intuition
        water: {
          50: '#f0f9fa',
          100: '#d9f0f3',
          200: '#b8e2e7',
          300: '#87cdd6',
          400: '#4faebe',
          500: '#3492a3',
          600: '#2e778a',
          700: '#2b6171',
          800: '#2a505d',
          900: '#27444f',
          950: '#152c35',
        },
        // Background tones
        cream: '#fdfcf9',
        parchment: '#f8f6f1',
        sand: '#efe9de',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'serif'],
      },
      borderRadius: {
        'soft': '0.625rem',
        'softer': '1rem',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(45, 62, 48, 0.08), 0 4px 16px -4px rgba(45, 62, 48, 0.12)',
        'soft-lg': '0 4px 16px -4px rgba(45, 62, 48, 0.1), 0 8px 32px -8px rgba(45, 62, 48, 0.15)',
        'glow': '0 0 20px -5px rgba(61, 154, 80, 0.25)',
        'glow-lg': '0 0 40px -10px rgba(61, 154, 80, 0.35)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(45, 62, 48, 0.05)',
      },
      backgroundImage: {
        'gradient-spirit': 'linear-gradient(135deg, #f0f7f1 0%, #e3ebe4 50%, #f0f7f1 100%)',
        'gradient-earth': 'linear-gradient(180deg, #fdfcf9 0%, #f8f6f1 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(61, 154, 80, 0.08) 0%, transparent 70%)',
        'gradient-mist': 'linear-gradient(180deg, rgba(222, 233, 230, 0.5) 0%, transparent 100%)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(61, 154, 80, 0.25)' },
          '50%': { boxShadow: '0 0 30px -5px rgba(61, 154, 80, 0.4)' },
        },
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'gentle': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
