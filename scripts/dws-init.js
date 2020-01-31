const path = require('path');
const spawn = require('cross-spawn');
const ora = require('ora');
const chalk = require('chalk');
const init = require('./init');
const installWP = require('./install-wp');
const docker = require('./docker');
const {appPkg, ownPath, appPath} = require('./config');
const {logURL} = require('./dws-url');

init();

console.log(
  '\n🐹 ' + chalk.green(`${chalk.bold('Project:')} ${appPkg.name}\n`)
);

async function afterDocker() {
  await installWP();
  console.log(
    `\n🐹 ${chalk.green.bold('Success:')} ${chalk.green(
      'WordPress is up and running!'
    )}`
  );
  logURL();
  process.exit(0);
}

const child = docker.compose('up', false);

let waitIndex = -1;
const waiting = [
  {
    ready: false,
    spinner: `Waiting database       ... `,
    pattern: new RegExp('database(.*?)mysqld: ready for connections.')
  },
  {
    ready: false,
    spinner: `Waiting for WordPress  ... `,
    pattern: new RegExp(
      `wordpress(.*?)AH00094: Command line: 'apache2 -D FOREGROUND'`
    )
  },
  {
    ready: false,
    spinner: `Waiting for phpMyAdmin ... `,
    pattern: new RegExp(
      `phpmyadmin(.*?)AH00094: Command line: 'apache2 -D FOREGROUND'`
    )
  }
];

const spinner = ora();
function nextSpinner() {
  waitIndex++;
  if (spinner.isSpinning) {
    spinner.succeed(waiting[waitIndex - 1].spinner + chalk.green('done'));
  }
  if (waitIndex < waiting.length) {
    spinner.start(waiting[waitIndex].spinner);
  } else {
    return false;
  }
  return true;
}

nextSpinner();

child.stdout.on('data', data => {
  const lines = data.toString().split(/\r?\n/);
  lines.forEach(line => {
    line = line.trim();
    waiting.forEach(service => {
      if (service.pattern.test(line) && !service.ready) {
        service.ready = true;
        if (!nextSpinner()) {
          afterDocker();
        }
      }
    });
  });
});

// child.stderr.on('data', data => {
//   console.error(`stderr: ${data}`);
// });

child.on('close', code => {
  process.exit(0);
});
