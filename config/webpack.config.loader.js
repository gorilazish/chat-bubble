const webpack = require('webpack')
const paths = require('./paths')

module.exports = {
  entry: paths.loaderIndexJs,
  output: {
    path: paths.appBuild,
    // name must match what's in the snippet
    filename: 'widget-loader.js', 
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    ],
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
}
