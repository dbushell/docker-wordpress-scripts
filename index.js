#!/usr/bin/env node

const chalk = require('chalk');
const execa = require('execa');
const {appPath, ownPath, logStream} = require('./scripts/config');

if (appPath === ownPath) {
  console.log(chalk.red.bold(`Cannot run in own repository!`));
  process.exit(1);
}

const args = process.argv.slice(2);

const commands = [
  'config',
  'init',
  'install-wp',
  'stop',
  'start',
  'destroy',
  'eject',
  'url',
  'up',
  'down',
  'version',
  'proxy-up',
  'proxy-down'
];

const usage = `
🐹 ${chalk.bold('Docker WordPress Scripts')}

  ${chalk.bold('Usage')}
    npx dws <command>

  ${chalk.bold('Commands')}
    init     ${chalk.dim('- spin up a new project')}
    stop     ${chalk.dim('- stop running containers')}
    start    ${chalk.dim('- start existing containers')}
    url      ${chalk.dim('- output the  *.localhost URL')}
    destroy  ${chalk.dim('- stop and remove existing containers')}
    eject    ${chalk.dim('- remove DWS dependency / add config files')}
`;

let command = args[0];

if (command === 'init') {
  command = 'up';
}

if (command === 'destroy') {
  command = 'down';
}

if (!commands.includes(command)) {
  console.log(usage);
  return;
}

const script = require.resolve(`./scripts/dws-${command}.js`);

async function run() {
  const result = execa('node', [script], {
    stdio: 'inherit',
    env: {
      DWS_COMMAND: command
    }
  });
  try {
    await result;
  } catch (err) {
    console.log(err);
  } finally {
    logStream.end();
  }
}

run();
