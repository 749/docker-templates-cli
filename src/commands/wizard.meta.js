const { __ } = require('./../lib/translate')

exports.command = ['wizard', '$0']

exports.describe = __('run the setup/edit wizard')

exports.builder = {}

exports.handler = async function (argv) {
  return require('./../workers/wizard.cmd')(argv)
}
