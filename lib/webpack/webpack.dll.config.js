'use strict';

var webpack = require('webpack');

module.exports = {
  entry: {
    // create two library bundles, one with jQuery and
    // another with Angular and related libraries\
    vendors: ['react', 'react-dom', 'react-router', 'history', 'react-addons-pure-render-mixin', "rc-input-number", 'lodash', 'react-redux', 'redux', 'react-router-redux', 'redux-thunk', 'redux-undo', 'react-bootstrap', 'jquery', "rc-select", "rc-tree", "rc-tree-select", "rc-notification", "moment", "highlight.js", "jquery-ui", "react-toastr", "classnames", "fullcalendar", "simditor"]
  },

  output: {
    filename: '[name].bundle.js',
    path: './static-dist/',

    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]_lib'
  },

  plugins: [new webpack.DllPlugin({
    // The path to the manifest file which maps between
    // modules included in a bundle and the internal IDs
    // within that bundle
    path: './static-dist/[name]-manifest.json',
    // The name of the global variable which the library's
    // require function has been assigned to. This must match the
    // output.library option above
    name: '[name]_lib'
  }), new webpack.optimize.UglifyJsPlugin()]
};