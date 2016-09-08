//
// node.js hook, resolve 'config' to `${cwd}/config/${env}.js`
// ref: https://github.com/ilearnio/module-alias
//

var Module = require('module');

function hook(cwd, env) {
  var oldResolveFilename = Module._resolveFilename
  Module._resolveFilename = function (request, parent, isMain) {

    // replace
    if (request == 'config') {
      request = `${cwd}/config/${env}.js`
    }

    return oldResolveFilename.call(this, request, parent, isMain)
  }
}

module.exports = hook
