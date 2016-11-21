var program = require('./program');
var express = require('express');
var cookieParser = require('cookie-parser');

console.log(`[RAS]: Project directory: ${program.cwd}, mode: ${program.env}`);

var server = new express();

server.use(cookieParser());

if (process.env.NODE_ENV == 'production' || program.env == 'production') {
  // production mode
  server.use('/', express.static(`${cwd}/static-dist`));
} else {
  // dev mode
}

// css modules require hook
var hook = require("css-modules-require-hook")
const lessParser = require('postcss-less').parse;
hook({
  extensions: ['.less','.css'],
  processorOpts: {parser: lessParser},
});

// config alias hook
var aliasHook = require("./config-alias-hook")
aliasHook(program.cwd, program.env);

// webpack
require('./webpack-middleware')(server, program.cwd, program.env)

// require('./proxy-middleware')(server)
// app
require('./app')(server, program.cwd, program.env)


// default port 3000
var port = process.env.PORT || 3000;

server.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
