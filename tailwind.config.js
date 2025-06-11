/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'golf-green': {
          100: '#e2f0d9',
          200: '#c5e0b4',
          300: '#a8d08f',
          400: '#8bc169',
          500: '#6eb144',
          600: '#578e36',
          700: '#416a27',
          800: '#2b4719',
          900: '#16230a',
        },
        'fairway': {
          100: '#eef8e8',
          200: '#dcf1d2',
          300: '#c1e4aa',
          400: '#a5d681',
          500: '#89c959',
          600: '#6dbb31',
          700: '#589428',
          800: '#436e1e',
          900: '#2e4914',
        },
        'sand': {
          100: '#f9f6e8',
          200: '#f3edd0',
          300: '#ece3b9',
          400: '#e6daa2',
          500: '#e0d18b',
          600: '#d9c773',
          700: '#d3be5c',
          800: '#ccb545',
          900: '#c6ab2e',
        }
      },
    },
  },
  plugins: [],
} 