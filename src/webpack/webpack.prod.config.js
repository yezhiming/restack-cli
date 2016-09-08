var webpack = require('webpack');

var makeConfig = require("./base.config.js").makeConfig;
var project = require('../project')

module.exports = makeConfig({
  entry: project.entries,
  output: {
    path: './static-dist',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
})
