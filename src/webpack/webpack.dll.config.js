var webpack = require('webpack')

module.exports = {
  entry: {
    // create two library bundles, one with jQuery and
    // another with Angular and related libraries\
    vendors: [
      'react', 'react-dom', 'react-addons-pure-render-mixin', // react stuff
      'redux', 'react-redux', // redux stuff
      'react-router', 'history', 'react-router-redux', // router stuff
      'lodash', "classnames",
      'jquery', "moment",
      'react-bootstrap'
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: './dll',

    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: './dll/[name]-manifest.json',
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_lib'
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
}
