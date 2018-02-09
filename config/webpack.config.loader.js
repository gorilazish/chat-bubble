'use strict'

const autoprefixer = require('autoprefixer')
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
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: false,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
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
