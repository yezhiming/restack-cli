import fs                         from 'fs'
import path                       from 'path'
import traverse                   from 'fs-tree-traverse'

import _                          from 'lodash'
import express                    from 'express'

import React                      from 'react'
import ReactDOM                   from 'react-dom/server';

import { Provider }               from 'react-redux';
import { RouterContext, match }   from 'react-router';

import {i18n, configureStore}     from 'restack-core'

// css modules require hook
var hook = require("css-modules-require-hook")
const lessParser = require('postcss-less').parse;
hook({
  extensions: ['.less','.css'],
  processorOpts: {parser: lessParser},
});


function loadI18nToolsRegistry(cwd) {

  try {
    return fs.readdirSync(`${cwd}/static/lang`)
    .reduce((all, each) => {
      var lang = each.replace('.json', '')
      all[lang] = new i18n.Tools({ localeData: require(`${cwd}/static/lang/${each}`), locale: lang })
      return all
    }, {})
  } catch(e) {
    return {
      "zh-cn": {}
    }
  }

}

function loadReducers(cwd) {
  var reducers = traverse.listSync(`${cwd}/src/js/reducers`)
  .filter(each => {
    return each.endsWith('.js')
  })
  .map(each => {
    return require(each).default
  })
  .reduce((all, each) => {
    return {...each, ...all}
  }, {})

  return reducers;
}

/*
 * restack app server rendering
 *
 * @param server express instance
 * @param cwd project folder path
 */
module.exports = function(server, cwd) {

  server.use('/lang', express.static(`${cwd}/static/lang`))

  const routes = require(`${cwd}/src/js/routes`).default
  const reducers = loadReducers(cwd)
  const i18nToolsRegistry = loadI18nToolsRegistry(cwd)
  const config = require(`${cwd}/config/development`)

  server.use((req, res) => {

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {

      console.log(`match: ${req.url}, error: ${error}, redirect: ${redirectLocation}, render: ${!!renderProps}`)

      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (!renderProps) {
        res.status(404).send('Not found')
      } else {

        const store = configureStore(reducers);
        const i18nTools = i18nToolsRegistry['zh-cn'];

        const componentHTML = ReactDOM.renderToString(
          <Provider store={store}>
            <i18n.Provider i18n={i18nTools}>
              <RouterContext {...renderProps}/>
            </i18n.Provider>
          </Provider>
        );

        // render
        const html = require('./renderHTML').default({
          componentHTML,
          config,
          staticNames: ["vendors", "index"]
        })
        res.type('html')
        res.end(html)
      }
    })

  });

}
