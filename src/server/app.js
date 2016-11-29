import fs                         from 'fs'
import path                       from 'path'
import traverse                   from 'fs-tree-traverse'

import _                          from 'lodash'
import express                    from 'express'

import React                      from 'react'
import ReactDOM                   from 'react-dom/server';

import { Provider }               from 'react-redux';
import { RouterContext, match }   from 'react-router';

import { createApp } from 'restack-core'
import { Tools, Provider as I18nProvider } from 'restack-core/lib/plugins/i18n-plugin'

function loadI18nToolsRegistry(cwd) {

  try {
    return fs.readdirSync(`${cwd}/public/lang`)
    .reduce((all, each) => {
      var lang = each.replace('.json', '')
      all[lang] = new Tools({ localeData: require(`${cwd}/public/lang/${each}`), locale: lang })
      return all
    }, {})
  } catch(e) {
    console.error(e)
    return {
      "zh-CN": {}
    }
  }

}

function loadReducers(cwd, env) {

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
module.exports = function(server, cwd, env) {

  server.use('/static', express.static(`${cwd}/public`))

  // 运行时的require，只会使用原始的node require，babel不生效
  const routes = require(`${cwd}/src/js/routes`).default
  const reducers = loadReducers(cwd, env)
  const i18nToolsRegistry = loadI18nToolsRegistry(cwd)
  const config = require(`${cwd}/config/${env}`)

  // this middleware will intercept all requests, should always place at last
  // if target app declare wildcard routes like "*", this middleware will stop requests from pass-through,
  // which may makes app-server go wrong
  server.use((req, res, next) => {

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {

      console.log(`[Restack server rendering]: ${req.url}, error: ${error}, redirect: ${redirectLocation}, render: ${!!renderProps}`)

      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {

        let componentHTML = "";

        if (config.universal) {
          const store = configureStore(reducers);
          const i18nTools = i18nToolsRegistry['zh-CN'];

          componentHTML = ReactDOM.renderToString(
            <Provider store={store}>
              <I18nProvider i18n={i18nTools}>
                <RouterContext {...renderProps}/>
              </I18nProvider>
            </Provider>
          );
        }

        // render
        const html = require('./renderHTML').default({
          componentHTML,
          config
        })
        res.type('html')
        res.end(html)

      } else {
        next()
      }
    })

  });

}
