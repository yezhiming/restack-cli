import fs                         from 'fs'
import path                       from 'path'
import traverse                   from 'fs-tree-traverse'

import _                          from 'lodash'
import express                    from 'express'

import React                      from 'react'
import ReactDOM                   from 'react-dom/server';

import { Provider }               from 'react-redux';
import { RouterContext, match }   from 'react-router';

module.exports = function(server){

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
        const html = require('./renderHTML_index').default({
          componentHTML,
          config: project,
          staticNames: ["vendors","index"]
        })
        res.type('html')
        res.end(html)
      }
    })

  });

}
