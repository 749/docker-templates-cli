const os = require('os')
const fs = require('fs')
const path = require('path')
const xdgBasedir = require('xdg-basedir')
const makeDir = require('make-dir')
const makeDirOptions = { mode: 0o0700 }
const packageJson = require(path.join(path.dirname(path.dirname(__dirname)), 'package.json'))

const files = {
  cwd () {
    return process.cwd()
  },
  packageJson () {
    return packageJson
  },
  configDir () {
    let dir = xdgBasedir.config
    if (!dir) {
      dir = path.join(os.homedir(), `.${packageJson.name}`)
    } else {
      dir = path.join(dir, packageJson.name)
    }
    return files.ensureDirExists(dir)
  },
  repoDir () {
    let dir = xdgBasedir.data
    if (!dir) {
      dir = files.configDir()
    }
    dir = path.join(dir, 'repo')
    return files.ensureDirExists(dir)
  },
  ensureDirExists (dir) {
    return makeDir.sync(dir, makeDirOptions)
  },
  getSubDirs (dir) {
    return fs.readdirSync(dir).map(name => path.join(dir, name)).filter(files.isDir)
  },
  isFile (source) {
    return fs.lstatSync(source).isFile()
  },
  isDir (source) {
    return fs.lstatSync(source).isDirectory()
  },
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath)
  }
}

module.exports = files
