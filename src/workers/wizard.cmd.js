const chalk = require('chalk')

const cli = require('./../helpers/cli')
const ask = require('./../lib/inquire')
const dockerCompose = require('./../lib/docker-compose')
const { __ } = require('./../lib/translate')

module.exports = async function wizard (argv) {
  await cli.ensureRepoExists()

  cli.status.message(__('Loading available configurations...'))
  cli.status.start()
  let availablePrograms, currentlyActive
  try {
    availablePrograms = await cli.loadAvailablePrograms()
    currentlyActive = Object.keys(cli.config.modules)
      .filter(prog => cli.config.modules[prog].active === true)
  } finally {
    cli.status.stop()
  }
  const chosenPrograms = (await ask.whichPrograms(Object.keys(availablePrograms), currentlyActive)).modules
  const removedPrograms = currentlyActive.filter(prog => !chosenPrograms.includes(prog))

  // TODO: Add config selections to modules
  // TODO: make the .env file editable

  if (chosenPrograms.length <= 0 && removedPrograms <= 0) {
    console.log(chalk.yellow(__('No Changes detected!\nexiting...')))
  } else if (ask.apply(chosenPrograms, removedPrograms).apply === true) {
    cli.status.message('')
    cli.status.start()
    try {
      removedPrograms.forEach(async name => {
        try {
          cli.status.message(__('Stopping unwanted active program [%s]...', name))
          await dockerCompose.stop(cli.config.modules[name])
          cli.config.modules[name].active = false
        } catch (err) {
          console.log(chalk.red(__('Could not stop "%s"!', name)))
          console.log(chalk.red(JSON.stringify(err, (key, val) => val, true)))
        }
      })

      chosenPrograms.forEach(async name => {
        try {
          cli.status.message(__('Activating [%s]...', name))
          const prog = cli.config.modules[name]
          await dockerCompose.up(prog)
          prog.active = true
        } catch (err) {
          console.log(chalk.red(__('Could not activate "%s"!', name)))
          console.log(chalk.red(JSON.stringify(err, (key, val) => val, true)))
        }
      })

      cli.status.message(__('Storing new configuration...'))
      cli.savedConfig.all = cli.config
      console.log(__('done'))
    } finally {
      cli.status.stop()
    }
  }
}
