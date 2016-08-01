var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var makeConfig = require("./base.config.js").makeConfig;

module.exports = function(cwd, project) {

  var entries = _.mapValues(project.entries, function(v, k){
    return path.join(cwd, v)
  })

  entries = _.mapValues(entries, function(v, k){
    const path = project.staticUrl ? `path=${project.staticUrl}/__webpack_hmr` : ""
    return [v, `webpack-hot-middleware/client?${path}`, 'webpack/hot/only-dev-server'] //['webpack-dev-server/client?http://localhost:3000/']
  })

  return makeConfig({
    devtool: "eval-source-map",
    //为每个entry增加hot load
    entry: entries,
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      },
      port: 8050,
      contentBase: "src"
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: require(`${cwd}/static-dist/vendors-manifest.json`),
      })
    ]
  })
}
