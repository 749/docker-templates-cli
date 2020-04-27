
const path = require('path')
const { Spinner } = require('clui')
const chalk = require('chalk')
const ConfigStore = require('configstore')
const _ = require('lodash')
const glob = require('glob')

const packageJson = require('./../../package.json')
const files = require('./../lib/files')
const ask = require('./../lib/inquire')

const { __ } = require('./../lib/translate')
const configDir = files.configDir()
const repoDir = path.join(configDir, 'repo')
const git = require('cmd-executor').git

const cli = {
  status: new Spinner(''),
  savedConfig: new ConfigStore(packageJson.name, packageJson.defaultConfig, {
    globalConfigPath: true,
    configPath: path.join(configDir, 'config.json')
  }),
  config: null,
  async ensureRepoExists () {
    console.log('\n')
    if (!files.directoryExists(path.join(repoDir, '.git'))) {
      files.ensureDirExists(repoDir)
      cli.config = {
        ...cli.config,
        ...await ask.repoUrl(cli.config.repo)
      }
      cli.status.message(__('Setting up repository...'))
      cli.status.start()
      try {
        await git.clone(cli.config.repo, repoDir)
      } finally {
        cli.status.stop()
      }
    } else {
      console.log(chalk.yellow('The following action may break, please use only if you know what "git rebase" is.'))
      const res = await ask.refreshRepo(cli.config.repo)
      if (res.refresh === true) {
        const fetchPromise = git.fetch(cli.config.repo, 'master')
        cli.status.message(__('Refreshing remote...'))
        cli.status.start()
        try {
          await fetchPromise
          cli.status.message(__('Rebasing your changes ...'))
          await git.rebase('origin', 'master')
        } finally {
          cli.status.stop()
        }
      }
    }
  },

  async loadAvailablePrograms () {
    const progs = {}
    files.getSubDirs(repoDir)
      .map(dir => path.basename(dir))
      .filter(name => !name.startsWith('.'))
      .forEach(dir => {
        progs[path.basename(dir)] = {
          configs: glob.sync(path.join(dir, 'docker-compose*.yml'))
            .filter(files.isFile)
            .map(name => path.basename(name))
            .map(name => {
              return name.substr(14, -4)
            })
            .filter(name => name !== null && name !== '')
        }
      })
    return progs
  }
}

cli.config = _.cloneDeep(cli.savedConfig.all)

module.exports = cli
