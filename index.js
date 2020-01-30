#!/usr/bin/env node
const chalk = require('chalk');
const spawn = require('cross-spawn');

const args = process.argv.slice(2);

const commands = ['up', 'down', 'start', 'stop'];

const command = args[0];

if (!commands.includes(command)) {
  console.log(chalk.red.bold(`Unknown command: "${command}"`));
  return;
}

const script = require.resolve(`./scripts/${command}.js`);

const result = spawn.sync('node', [script], {
  stdio: 'inherit'
});

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(chalk.red.bold(`Process was killed (SIGKILL)`));
  } else if (result.signal === 'SIGTERM') {
    console.log(chalk.red.bold(`Process was killed (SIGTERM)`));
  }
  process.exit(1);
}

// if (result.status === 1) {
//   console.log(result);
// }

process.exit(result.status);
