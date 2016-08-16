require('babel-core/register');
require('babel-polyfill');

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

require('./app')(server, program.cwd)


// default port 3000
var port = process.env.PORT || 3000;

server.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
