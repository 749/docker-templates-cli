const i18n = require('i18n')
const path = require('path')

i18n.configure({
  directory: path.join(path.dirname(path.dirname(__dirname)), 'locales')
})

module.exports = {
  ...i18n
}
