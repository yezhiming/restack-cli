var program = require('commander');

// Current working directory, default to process.cwd()
var cwd = process.cwd();

program
  .version('0.0.1')
  .option('-p, --production', 'Production mode')
  .arguments('<project>')
  .action(function(project){
    // change cwd if argument provided
    cwd = project
  })
  .parse(process.argv);

// load project config
var project = require(`${cwd}/project`)

var express = require('express');

// init express instance
var app = new express();

// run in dev mode with webpack
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../webpack/webpack.dev.config')(cwd, project);

// ref: http://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: "/",
  stats: { colors: true }
}));
app.use(webpackHotMiddleware(compiler, {
  hot: true
}));

var port = process.env.PORT || 8050;

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
