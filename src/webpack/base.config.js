"use strict";
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HappyPack = require('happypack');

const config = {
  entry: {
    frameworks: [
      'react', 'react-dom', 'react-addons-pure-render-mixin', // react stuff
      'redux', 'react-redux', 'redux-thunk', // redux stuff
      'react-router', 'history', 'react-router-redux' // router stuff
    ]
  },
  output: {
    // path: relative to cwd(current working directory), not work with path.resolve(__dirname, xxxx)
    path: '/static',
    publicPath: "/",
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'},
      {test: /\.jsx?$/, loaders: ['babel'], exclude: /(node_modules|bower_components)/, happy: { id: 'jsx' }},
      // {test: /\.less$/, loader: 'style!css!less-loader'}, //使用less简写可能会出现问题
      // {test: /\.css$/, loader: 'style!css'},
      {test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
      //other assets
      {test: /\.eot(\?\w+)?/, loader: 'url?limit=5000'}, // 'file' ?
      {test: /\.(woff|woff2)(\?\w+)?/, loader: 'url?limit=5000&mimetype=application/font-woff'},
      {test: /\.ttf(\?\w+)?/, loader: 'url?limit=5000&mimetype=application/octet-stream'},
      {test: /\.svg(\?\w+)?/, loader: 'url?limit=5000&mimetype=image/svg+xml'},
      {test: /\.(png|jpg|gif)$/, loader: 'url?limit=25000'}
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx'],
    alias: {
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify( process.env.NODE_ENV || 'development' )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: `vendors.js`,
      // (Modules must be shared between 3 entries)
      minChunks: 2
      // (Only use between these entries)
      // chunks: ["index", "kitchensink"]
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new ExtractTextPlugin("[name].css"),
    new HappyPack({
      id: 'jsx',
      threads: 10,
    })
  ]
}

// merge webpack config options
function merge(target, source) {
  // base props
  target = Object.assign( {}, target, _.pick(source, ['devtool']) )

  target.entry = Object.assign({}, target.entry, source.entry)
  target.output = Object.assign({}, target.output, source.output)
  target.plugins = target.plugins.concat( source.plugins )
  target.resolve.alias = Object.assign({}, target.resolve.alias, source.resolve.alias)

  return target
}

module.exports.makeConfig = function(newConfig) {
  return merge(_.cloneDeep(config), newConfig);
}
