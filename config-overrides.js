module.exports = function override(config, env) {
  config.resolve.alias['@'] = require('path').resolve('src')
  switch (env) {
    case 'production':
      config.devtool = false
      break
    default:
      config.devtool = 'source-map'
      break
  }
  return config
}
