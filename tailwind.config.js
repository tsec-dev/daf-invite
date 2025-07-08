/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'military-blue': '#003366',
        'space-force-blue': '#00205B',
        'air-force-blue': '#00308F',
      },
      fontFamily: {
        'military': ['Georgia', 'serif'],
        'formal': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}