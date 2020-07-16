const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
      '.storybook': path.resolve(__dirname),
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.s?[ca]ss$/,
      //   loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      //   include: path.resolve(__dirname, '../'),
      // },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: 'file-loader?name=fonts/[name].[ext]!static'
      }
    ]
  }
}