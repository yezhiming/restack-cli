'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _nodemon = require('nodemon');

var _nodemon2 = _interopRequireDefault(_nodemon);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 用nodemon启动node进程
// 启动webpack进程

var cwd = process.cwd();
console.log('Current directory: ' + cwd);

_commander2.default.version('0.0.1').option('-p, --production', 'Production mode').parse(process.argv);

var server = new _express2.default();

server.use((0, _cookieParser2.default)());

if (process.env.NODE_ENV == 'production' || _commander2.default.production) {
  // production mode
  server.use('/', _express2.default.static(cwd + '/static-dist'));
  console.log('p');
} else {
  // dev mode
}

(0, _nodemon2.default)({
  script: 'app.js',
  ext: 'js json'
});

_nodemon2.default.on('start', function () {
  console.log('App has started');
}).on('quit', function () {
  console.log('App has quit');
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});

// require('./app')(server)

// default port 3000
var port = process.env.PORT || 3000;

server.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});