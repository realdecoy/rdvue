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
     /**
     * Color values are defined in /src/theme/colors.scss.
     * Color names should be sematic in order to provide
     * contextual alignment when thinking about themes.
     * E.g. primary-text-color (semantic) vs black-1 (literal)
     */
    colors: {
      typography: {
        // primary: 'var(--typography-primary)',
      },
    },
    extend: {
      // Add new values that will be merged with Tailwind's defaults.
    },
  },
  variants: {},
  plugins: [],
};
