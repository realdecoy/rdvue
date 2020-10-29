/**
 * Extend Vue's Webpack configuration.
 */
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const isProd = process.env.NODE_ENV === 'production';
const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const options = require('./.rdvue/options');
const { IconWebpackPlugin } = require('./.rdvue') 

module.exports = {
  chainWebpack: (config) => {
    // Prevent all chunks from being loaded in index. Chunks
    // will be properly loaded on demand otherwise.
    config.plugins.delete('prefetch');
  },
  configureWebpack: {
    externals: {
      resolve: {
        alias: {
          '.rdvue': path.resolve(__dirname, '.rdvue/'),
        }
      },
      // Packages to exclude. E.g. 'highlight.js'
    },
    plugins: [...(isProd ?
      // ----------------------------------------------------------------------
      // PRODUCTION PLUGINS
      // ----------------------------------------------------------------------
      [

        // Produces a bundle report for production build. 
        // Generates a report to be viewed later.
        new BundleAnalyzerPlugin( {analyzerMode: "static"} ),

        // Reduce image size for assets in Production build.
        new ImageminPlugin({
          test: /\.(jpe?g|png|gif|svg)$/i,
          pngquant: {
            quality: '80-90'
          },
          plugins: [
            imageminMozjpeg({
              quality: 80,
              progressive: false
            })
          ]
        })
      ] :

      // ----------------------------------------------------------------------
      // DEV PLUGINS
      // ----------------------------------------------------------------------
      [
        new IconWebpackPlugin({
          disable: false
        }),
        // Add plugins
      ])],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        automaticNameDelimiter: '.',
        chunks: 'all',
        cacheGroups: {
          /**
           * Chunking example. 
           *
          charts: {
            test: /[\\/]node_modules[\\/]apexcharts[\\/]/,
            name: 'charts',
            priority: 15
          },
          */
          buefy: {
            test: /[\\/]node_modules[\\/]buefy[\\/]/,
            name: 'buefy',
            priority: 10
          },
          // Vendor is a catch-all for code which hasn't been added
          // to a chunk with a higher priority.
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 5 // Keep lowest priority to effect as default.
          }
        }
      }
    }
  },

  pluginOptions: options
};
