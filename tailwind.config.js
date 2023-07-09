/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/base.html', './static/sub.js'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}

