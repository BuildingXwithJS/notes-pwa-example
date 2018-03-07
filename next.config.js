const withCSS = require('@zeit/next-css');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = withCSS({
  webpack(config) {
    // Perform customizations to webpack config

    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        runtimeCaching: [
          {
            handler: 'networkFirst',
            urlPattern: /^https?.*/,
          },
        ],
      })
    );

    // Important: return the modified config
    return config;
  },
});
