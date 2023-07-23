/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'stars': 'url(\'/assets/stars.jpg\')'
      },
      fontFamily: {
        'pixel': ['pixel', 'sans-serif']
      }
    },
  },
  plugins: [],
}

