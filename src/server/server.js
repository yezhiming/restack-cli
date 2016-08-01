// 用nodemon启动node进程
// 启动webpack进程

import program      from 'commander';
import nodemon      from 'nodemon';
import express      from 'express';
import cookieParser from 'cookie-parser';

var cwd = process.cwd();
console.log(`Current directory: ${cwd}`);

program
  .version('0.0.1')
  .option('-p, --production', 'Production mode')
  .parse(process.argv);


var server = new express();

server.use(cookieParser());

if (process.env.NODE_ENV == 'production' || program.production) {
  // production mode
  server.use('/', express.static(`${cwd}/static-dist`));
  console.log('p')
} else {
  // dev mode
}


// require('./app')(server)




// default port 3000
var port = process.env.PORT || 3000;

server.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
