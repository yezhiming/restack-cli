import path from 'path'
import fs from 'fs'
import proxy from 'http-proxy-middleware'
import _ from 'lodash'

/**
 * http代理中间件
 * 可以通过package.json，.httpproxy进行代理配置
 * 配置格式：
 * {
 *   "/:module/api/v1": {"target": "http://115.28.0.60:8085", "changeOrigin": true},
 *   "/:module/api/v2": "http://115.28.0.60:8085"
 * }
 */
module.exports = function(app, cwd, env) {

  let config = {}

  try {
    const extraConfig = fs.readFileSync(path.join(cwd, 'package.json'), {encoding: 'utf8'})
    config = Object.assign(config, JSON.parse(extraConfig.httpproxy))
  } catch (e) {
    console.error(`package.json not exists`)
  }

  try {
    const extraConfig = fs.readFileSync(path.join(cwd, '.httpproxy'), {encoding: 'utf8'})
    config = Object.assign(config, JSON.parse(extraConfig))
  } catch (e) {
    console.error(e)
    console.log(`.httpproxy not exists`)
  }

  config = _.mapValues(config, (v, k) => {
    return _.isString(v) ?  { target: v, changeOrigin: true } : v
  })

  console.log(`httpproxy config: ${JSON.stringify(config)}`)

  _.each(config, (v, k) => app.use(k, proxy(v)))

}
