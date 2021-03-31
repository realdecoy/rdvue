/**
 * Includes tailwind css libraries correctly inside our app
 */
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    autoprefixer,
    tailwindcss,
  ],
};
