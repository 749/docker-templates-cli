#!/bin/node
const yargs = require('yargs')
const chalk = require('chalk')
const figlet = require('figlet')
const packageJson = require('./../package.json')

async function main () {
  console.log(chalk.yellow(figlet.textSync(packageJson.shortName.toUpperCase(), { horizontalLayout: 'full' })))
  console.log(`${chalk.green(packageJson.name)} v${packageJson.version}`)

  return yargs
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands', {
      extensions: 'meta.js'
    })
    .help('h')
    .alias('h', 'help')
    .argv
}

main()
