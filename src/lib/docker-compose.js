const path = require('path')

const files = require('./files')

const dockerComposeCli = require('cmd-executor')['docker-compose']

const dockerCompose = {
  emptyModule (name) {
    return {
      active: false,
      name: name,
      configs: []
    }
  },
  generateFileParameter (module) {
    return [
      '-f "docker-compose.yml"',
      module.configs
        .map(config => `-f "docker-compose${config}.yml"`)
        .join(' ')
    ].join(' ')
  },
  async _cmd (module, action) {
    const cwd = process.cwd()
    try {
      process.chdir(path.join(files.repoDir(), module.name))
      await dockerComposeCli(`${dockerCompose.generateFileParameter(module)} ${action}`)
    } finally {
      process.chdir(cwd)
    }
  },
  async stop (module) {
    await dockerCompose._cmd(module, 'stop')
  },
  async create (module) {
    dockerCompose._cmd(module, 'up --no-start')
  },
  async start (module) {
    dockerCompose._cmd(module, 'start')
  }
}

module.exports = dockerCompose
