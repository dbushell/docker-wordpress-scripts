#!/usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const execa = require('execa');
const {appPath, ownPath, logStream} = require('./scripts/config');

if (appPath === ownPath) {
  console.log(chalk.red.bold(`Cannot run in own repository!`));
  process.exit(1);
}

async function run(command) {
  const script = require.resolve(`./scripts/dws-${command}.js`);
  const result = execa('node', [script], {
    stdio: 'inherit',
    env: {
      DWS_COMMAND: command
    }
  });
  try {
    await result;
  } catch (err) {
    // console.log(err);
  } finally {
    logStream.end();
  }
}

var argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command({
    command: ['up [proxy]', 'init'],
    describe: 'spin up a new project',
    builder: {
      proxy: {
        type: 'boolean',
        default: false
      }
    },
    handler: argv => {
      if (argv.proxy) {
        run('proxy-up');
      } else {
        run('up');
      }
    }
  })
  .command({
    command: ['down [proxy]', 'destroy'],
    describe: 'stop and remove existing containers',
    builder: {
      proxy: {
        type: 'boolean',
        default: false
      }
    },
    handler: argv => {
      if (argv.proxy) {
        run('proxy-down');
      } else {
        run('down');
      }
    }
  })
  .command('stop', 'stop running containers', {}, () => run('stop'))
  .command('start', 'start existing containers', {}, () => run('start'))
  .command('url', 'output the *.localhost URL', {}, () => run('url'))
  .command('eject', 'remove DWS dependency / add config files', {}, () =>
    run('eject')
  )
  .strict(true)
  .demandCommand().argv;
