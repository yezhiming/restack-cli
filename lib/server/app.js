'use strict';

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (server) {

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

        var store = configureStore(reducers);
        var i18nTools = i18nToolsRegistry['zh-cn'];

        var componentHTML = _server2.default.renderToString(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(
            i18n.Provider,
            { i18n: i18nTools },
            _react2.default.createElement(_reactRouter.RouterContext, renderProps)
          )
        ));

        // render
        var html = require('./renderHTML_index').default({
          componentHTML: componentHTML,
          config: project,
          staticNames: ["vendors", "index"]
        });
        res.type('html');
        res.end(html);
      }
    });
  });
};