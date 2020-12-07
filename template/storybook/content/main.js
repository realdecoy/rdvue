const path = require('path');

module.exports = {
  stories: ['../src/components/**/*.stories.([tj]s|mdx)'],
  addons: [
    '@storybook/preset-scss',
    '@storybook/preset-typescript',
  ],
  webpackFinal: async config => {
    // Remove the existing css rule
    config.module.rules = config.module.rules.filter(
      f => f.test.toString() !== '/\\.s[ca]ss$/'
    );
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.s?[ca]ss$/,
      loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  },
};
