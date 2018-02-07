const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const paths = require('./paths')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// load env variables from .env file into process.env
require('dotenv').config({ path: paths.dotenv })

if (!process.env.RECEIVER_ID) {
  throw new Error('Add RECEIVER_ID env variable')
}

const config = {
  entry: paths.loaderIndexJs,
  output: {
    path: paths.appBuild,
    // name must match what's in the snippet
    filename: 'widget-loader.js',
  },
  devServer: {
    contentBase: paths.appBuild,
    port: 4000,
    noInfo: true,
    watchContentBase: true,
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
}

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
]

if (process.env.NODE_ENV === 'development') {
  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.loaderHtml,
      filename: 'index.html',
    })
  )
  config.plugins.push(
    new InterpolateHtmlPlugin({
      RECEIVER_ID: process.env.RECEIVER_ID,
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = config
