/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: ["retro", "dark", "cupcake"],
  },
  content: ['./templates/base.html', './templates/signup.html', './templates/splash.html', './templates/sequencer.html', './templates/new.html', './templates/sequencerv2.html', './static/sub.js'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}

