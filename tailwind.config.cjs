const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        pastel_bg: '#fef6e4', // Soft pastel background
        pastel_card: '#fffaf0', // Soft card background
        pastel_accent: '#e0f7fa', // Soft accent
        brand_pink: '#ff8fab',
        brand_teal: '#7bdcb5',
      },
    },
  },
  plugins: [],
} 