/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
      },
    },
  },
  plugins: [],
};
