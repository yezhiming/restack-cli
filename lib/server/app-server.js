'use strict';

require('babel-core/register');
require('babel-polyfill');

var program = require('commander');
var nodemon = require('nodemon');
var express = require('express');
var cookieParser = require('cookie-parser');

// Current working directory, default to process.cwd()
var cwd = process.cwd();

program.version('0.0.1').option('-p, --production', 'Production mode').arguments('<project>').action(function (project) {
  // change cwd if argument provided
  cwd = project;
}).parse(process.argv);

console.log('[RAS]: Project directory: ' + cwd + ', mode: ' + (program.production ? 'production' : 'development'));

var server = new express();

server.use(cookieParser());

if (process.env.NODE_ENV == 'production' || program.production) {
  // production mode
  server.use('/', express.static(cwd + '/static-dist'));
} else {
  // dev mode
}

require('./app')(server, cwd);

// default port 3000
var port = process.env.PORT || 3000;

server.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});