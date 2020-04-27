const inquirer = require('inquirer')
const { __ } = require('./translate')

module.exports = {
  repoUrl (current) {
    const question = {
      name: 'repo',
      type: 'url',
      message: __('Which docker-templates repo?'),
      default: current
    }
    return inquirer.prompt(question)
  },
  refreshRepo (url) {
    const question = {
      name: 'refresh',
      type: 'confirm',
      message: __('Should I rebase onto "%s"?', url),
      default: false
    }
    return inquirer.prompt(question)
  },
  whichPrograms (choices, current) {
    const question = {
      name: 'modules',
      type: 'checkbox',
      choices: choices,
      message: __('Which programs do you want to install?'),
      default: current
    }
    return inquirer.prompt(question)
  },
  whichConfigs (program, choices, current) {
    const question = {
      name: 'configs',
      type: 'checkbox',
      choices: choices,
      message: __('Which configs do you want to use with %s?', program),
      default: current
    }
    return inquirer.prompt(question)
  },
  apply (updated, removed) {
    console.log('')
    console.log('The following composer-files will be:\n - stopped:\n  - "%s"\n - updated/started:\n  - "%s"', removed.join('",\n   - "'), updated.join('",\n   - "'))
    const question = {
      name: 'apply',
      type: 'confirm',
      message: __('Should I apply these changes?'),
      default: false
    }
    return inquirer.prompt(question)
  }
}
