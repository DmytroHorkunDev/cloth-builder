/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    keyframes: {
      textShimmer: {
        '0%': {backgroundPosition: '-230px -500px'},
        '80%': {backgroundPosition: '-230px -500px'},
        '100%': {backgroundPosition: '230px 500px'}
      }
    },
    fontFamily: {
      nunito: ['Nunito Sans', 'sans-serif'],
    },
    extend: {
      animation: {
        textShimmer: 'textShimmer 5s ease-in-out infinite',
      },
      ringColor: '#284357',
      colors: {
        'brand': '#000000'
      }
    },
  },
  plugins: [],
}

