'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsTreeTraverse = require('fs-tree-traverse');

var _fsTreeTraverse2 = _interopRequireDefault(_fsTreeTraverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

var _restackCore = require('restack-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// css modules require hook
var hook = require("css-modules-require-hook");
var lessParser = require('postcss-less').parse;
hook({
  extensions: ['.less', '.css'],
  processorOpts: { parser: lessParser }
});

function loadI18nToolsRegistry(cwd) {

  try {
    return _fs2.default.readdirSync(cwd + '/static/lang').reduce(function (all, each) {
      var lang = each.replace('.json', '');
      all[lang] = new _restackCore.i18n.Tools({ localeData: require(cwd + '/static/lang/' + each), locale: lang });
      return all;
    }, {});
  } catch (e) {
    return {
      "zh-cn": {}
    };
  }
}

function loadReducers(cwd) {
  var reducers = _fsTreeTraverse2.default.listSync(cwd + '/src/js/reducers').filter(function (each) {
    return each.endsWith('.js');
  }).map(function (each) {
    return require(each).default;
  }).reduce(function (all, each) {
    return (0, _extends3.default)({}, each, all);
  }, {});

  return reducers;
}

/*
 * restack app server rendering
 *
 * @param server express instance
 * @param cwd project folder path
 */
module.exports = function (server, cwd) {

  server.use('/lang', _express2.default.static(cwd + '/static/lang'));

  var routes = require(cwd + '/src/js/routes').default;
  var reducers = loadReducers(cwd);
  var i18nToolsRegistry = loadI18nToolsRegistry(cwd);
  var config = require(cwd + '/config/development');

  server.use(function (req, res) {

    (0, _reactRouter.match)({ routes: routes, location: req.url }, function (error, redirectLocation, renderProps) {

      console.log('match: ' + req.url + ', error: ' + error + ', redirect: ' + redirectLocation + ', render: ' + !!renderProps);

      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (!renderProps) {
        res.status(404).send('Not found');
      } else {

        var store = (0, _restackCore.configureStore)(reducers);
        var i18nTools = i18nToolsRegistry['zh-cn'];

        var componentHTML = config.isomorphic ? _server2.default.renderToString(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            _restackCore.i18n.Provider,
            { i18n: i18nTools },
            _react2.default.createElement(_reactRouter.RouterContext, renderProps)
          )
        )) : "";

        // render
        var html = require('./renderHTML').default({
          componentHTML: componentHTML,
          config: config
        });
        res.type('html');
        res.end(html);
      }
    });
  });
};