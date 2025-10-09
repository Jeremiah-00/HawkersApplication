/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        vodafone: {
          red: '#EF3E42',
          dark: '#cc2933',
        },
      },
    },
  },
  plugins: [],
}

