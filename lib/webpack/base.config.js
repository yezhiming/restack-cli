"use strict";

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HappyPack = require('happypack');

var config = {
  entry: {
    frameworks: ['react', 'react-dom', 'react-addons-pure-render-mixin', // react stuff
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
    loaders: [{ test: /\.json$/, loader: 'json' }, { test: /\.jsx?$/, loaders: ['babel'], exclude: /(node_modules|bower_components)/, happy: { id: 'jsx' } },
    // {test: /\.less$/, loader: 'style!css!less-loader'}, //使用less简写可能会出现问题
    // {test: /\.css$/, loader: 'style!css'},
    { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") }, { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
    //other assets
    { test: /\.eot(\?\w+)?/, loader: 'url?limit=5000' }, // 'file' ?
    { test: /\.(woff|woff2)(\?\w+)?/, loader: 'url?limit=5000&mimetype=application/font-woff' }, { test: /\.ttf(\?\w+)?/, loader: 'url?limit=5000&mimetype=application/octet-stream' }, { test: /\.svg(\?\w+)?/, loader: 'url?limit=5000&mimetype=image/svg+xml' }, { test: /\.(png|jpg|gif)$/, loader: 'url?limit=25000' }]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx'],
    alias: {}
  },
  plugins: [new webpack.DefinePlugin({
    "process.env": {
      BROWSER: (0, _stringify2.default)(true),
      NODE_ENV: (0, _stringify2.default)(process.env.NODE_ENV || 'development')
    }
  }), new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: 'vendors.js',
    // (Modules must be shared between 3 entries)
    minChunks: 2
    // (Only use between these entries)
    // chunks: ["index", "kitchensink"]
  }), new webpack.NoErrorsPlugin(), new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])), new ExtractTextPlugin("[name].css"), new HappyPack({
    id: 'jsx',
    threads: 10
  })]
};

// merge webpack config options
function merge(target, source) {
  // base props
  target = (0, _assign2.default)({}, target, _.pick(source, ['devtool']));

  target.entry = (0, _assign2.default)({}, target.entry, source.entry);
  target.output = (0, _assign2.default)({}, target.output, source.output);
  target.plugins = target.plugins.concat(source.plugins);

  return target;
}

module.exports.makeConfig = function (newConfig) {
  return merge(_.cloneDeep(config), newConfig);
};