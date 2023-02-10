module.exports = function override(config, env) {
  config.resolve.alias['@'] = require('path').resolve('src')
  // config.resolve.fallback = {
  //   assert: require.resolve('assert/'),
  //   stream: require.resolve('stream-browserify'),
  // }
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
