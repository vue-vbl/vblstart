#!/usr/bin/env node

var vblstartMaster = require('download-git-repo')
var commander = require('commander')
var ora = require('ora')
var chalk = require('chalk')
var path = require('path')
var figlet = require('figlet')
var spawn = require('child_process').spawn

console.log(chalk.blue(figlet.textSync("VblStart")))

commander
    .version(require('./../package').version)
    .usage('<project-name>')
    .option('-c, --clone', 'use git clone')
    .parse(process.argv)

commander.on('--help', function() {
    console.log()
    console.log('  Example:')
    console.log()
    console.log('    $ vblstart <project-name>')
    console.log()
})

function help() {
    commander.parse(process.argv)
    if (commander.args.length < 1) return commander.help()
}

help()

/**
 * Settings.
 */

var name = commander.args[0]
var to = path.resolve(name)
var clone = commander.clone || false

/**
 * Notice
 */
function printMessage() {
    var message = `
# Project initialization finished!
# ========================

To get started:


    ${to === process.cwd() ? '' : `cd ${to}\n`}npm run dev

  
Documentation can be found at https://vue-vbl.github.io/vue-vbl
`
    console.log(message)
}



/**
 * Install project
 */

function installDeps() {
    console.log('\n\n# Installing project dependencies ...')
    console.log('# ========================\n')
    
    var s = spawn('npm', ['install'], {
        cwd: to,
        stdio: 'inherit',
        shell: true
    })
    
    s.on('exit', () => {
        printMessage()
    })
}

/**
 * Download project
 */
function run() {
    var spinner = ora('downloading project')
    spinner.start()
    vblstartMaster("vue-vbl/vbl-template", to, { clone: clone }, function(err) {
        spinner.stop()
        if (!err) { 
            console.log(chalk.green(name + " has been successfully created."))
            installDeps();
         } else {
            console.log(chalk.red('Failed to download repo : ' + err.message.trim()))
        }
    })
}

/**
 * Trigger the installer.
 */
run()