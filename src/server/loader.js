// default babel config
let babelrc = {
  "presets": [
    "es2015",
    "stage-1",
    "react"
  ],
  "plugins": [
    "transform-runtime"
  ]
}

babelrc.presets = babelrc.presets.map( p => require(`babel-preset-${p}`) )
babelrc.plugins = babelrc.plugins.map( p => require(`babel-plugin-${p}`) )

require('babel-core/register');
require('babel-polyfill');

// app-server handles "react server rendering"
// run app-server with nodemon
// var nodemon = require('nodemon');

// var args = process.argv.slice(2).join(' ')

// nodemon(`-e "js json" ${__dirname}/app-server.js ${args}`)
//
// nodemon.on('start', function () {
//   console.log('App has started');
// }).on('quit', function () {
//   console.log('App has quit');
// }).on('restart', function (files) {
//   console.log('App restarted due to: ', files);
// });

require('./app-server');

// standalone express server instance with webpack-dev-middleware & webpack-hot-middleware
// require('./webpack-server');
