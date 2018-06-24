const now = require('./now')

module.exports = (msg) => {
  console.log(`[${now()}] ${msg}`)
}
