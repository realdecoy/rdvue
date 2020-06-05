module.exports = {
  purge: {
    content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
    // These options are passed through directly to PurgeCSS
    options: {
      whitelist: [
        // Add class names that shouldn't be purged while treeshaking.
      ],
    },
  },
  theme: {
    // Completely override Tailwind's default colors with your Style Guide's.
    // colors: {},
    extend: {
      // Add new values that will be merged with Tailwind's defaults.
    },
  },
  variants: {},
  plugins: [],
};
