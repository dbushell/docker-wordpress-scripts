#!/usr/bin/env node

import path from 'path';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import chalk from 'chalk';
import execa from 'execa';
import {appPath, ownPath, logStream} from '../scripts/config.js';

console.log(
  chalk.bold(
    '✨ This project is not under active development. It may not work with the latest Docker. Future DWS updates uncertain at this time. ✨'
  )
);

if (appPath === ownPath) {
  console.log(chalk.red.bold(`Cannot run in own repository!`));
  process.exit(1);
}

async function run(command) {
  const script = path.resolve(ownPath, `scripts/dws-${command}.js`);
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

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command('up', 'spin up a new project', {}, () => run('up'))
  .command('down', 'stop and remove containers', {}, () => run('down'))
  .command('stop', 'stop running containers', {}, () => run('stop'))
  .command('start', 'start existing containers', {}, () => run('start'))
  .command('url', 'output the *.localhost URL', {}, () => run('url'))
  .command('eject', 'replace DWS dependency with config files', {}, () =>
    run('eject')
  )
  .alias('version', 'v')
  .alias('help', 'h')
  .strict(true)
  .demandCommand().argv;
