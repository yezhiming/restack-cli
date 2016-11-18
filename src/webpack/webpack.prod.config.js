var webpack = require('webpack');

var makeConfig = require("./base.config.js").makeConfig;
var project = require('../project')

module.exports = makeConfig({
  entry: project.entries,
  output: {
    path: './static-dist',
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify( process.env.NODE_ENV || 'production' )
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
})
