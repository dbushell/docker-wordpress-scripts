#!/usr/bin/env node

const chalk = require('chalk');
const cross = require('cross-spawn');
const {appPath, ownPath, logStream} = require('./scripts/config');

if (appPath === ownPath) {
  console.log(chalk.red.bold(`Cannot run in own repository!`));
  process.exit(1);
}

const args = process.argv.slice(2);

const commands = ['config', 'init', 'stop', 'start', 'destroy', 'eject', 'url'];

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

if (command === 'up') {
  command = 'init';
}

if (command === 'down') {
  command = 'destroy';
}

if (!commands.includes(command)) {
  console.log(usage);
  return;
}

const script = require.resolve(`./scripts/dws-${command}.js`);

const result = cross.sync('node', [script], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DWS_COMMAND: command
  }
});

logStream.end();

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(chalk.red.bold(`Process was killed (SIGKILL)`));
  } else if (result.signal === 'SIGTERM') {
    console.log(chalk.red.bold(`Process was killed (SIGTERM)`));
  }
  process.exit(1);
}


process.exit(result.status);
