'use strict';

var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var makeConfig = require("./base.config.js").makeConfig;

module.exports = function (cwd, project) {

  var entries = _.mapValues(project.entries, function (v, k) {
    return path.join(cwd, v);
  });

  entries = _.mapValues(entries, function (v, k) {
    var path = project.staticUrl ? 'path=' + project.staticUrl + '/__webpack_hmr' : "";
    return [v, 'webpack-hot-middleware/client?' + path, 'webpack/hot/only-dev-server']; //['webpack-dev-server/client?http://localhost:3000/']
  });

  return makeConfig({
    devtool: "eval-source-map",
    //为每个entry增加hot load
    entry: entries,
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      },
      port: 8050,
      contentBase: "src"
    },
    output: {
      // 如果webpack-server的端口与app-server的端口不一样，hmr会使用这个路径作为前缀，加载热补丁
      publicPath: project.staticUrl + '/'
    },
    resolve: {
      alias: {
        config: cwd + '/config/development'
      }
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  });
};