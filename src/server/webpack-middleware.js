// run in dev mode with webpack
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

// ref: http://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server

module.exports = function(app, cwd, env) {

  var projectConfig = require(`${cwd}/config/${env}`)

  var webpackConfig = require(`../webpack/webpack.${env}.config`)(cwd, projectConfig)

  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: "/",
    stats: { colors: true }
  }));
  app.use(webpackHotMiddleware(compiler, {
    hot: true
  }));
}
