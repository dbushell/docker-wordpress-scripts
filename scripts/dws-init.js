const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const docker = require('./docker');
const installWP = require('./install-wp');
const {appConf, appPath, ownPath} = require('./config');
const {dwsPre} = require('./dws-pre');
const {dwsConfig} = require('./dws-config');
const {dwsURL} = require('./dws-url');

async function beforeDocker() {
  dwsPre();
  const conf = appConf();
  console.log(
    '\n🐹 ' + chalk.green(`${chalk.bold('Project:')} ${conf.name}\n`)
  );
  await dwsConfig();
}

async function afterDocker() {
  await installWP();
  console.log(
    `\n🐹 ${chalk.green.bold('Success:')} ${chalk.green(
      'WordPress is up and running!'
    )}`
  );
  dwsURL();
  process.exit(0);
}

async function dwsInit() {
  await beforeDocker();

  const child = docker.compose('up', false);

  const spinner = ora();

  const containers = [
    {
      ready: false,
      name: 'database',
      pattern: new RegExp('database(.*?)mysqld: ready for connections.')
    },
    {
      ready: false,
      name: 'WordPress',
      pattern: new RegExp(
        `wordpress(.*?)AH00094: Command line: 'apache2 -D FOREGROUND'`
      )
    },
    {
      ready: false,
      name: 'phpMyAdmin',
      pattern: new RegExp(
        `phpmyadmin(.*?)AH00094: Command line: 'apache2 -D FOREGROUND'`
      )
    }
  ];

  function updateReady() {
    const notReady = containers.reduce((arr, service) => {
      if (!service.ready) {
        arr.push(service.name);
      }
      return arr;
    }, []);
    if (notReady.length) {
      spinner.start(`Waiting for containers: ${notReady.join(', ')}...`);
    } else {
      spinner.succeed('Docker containers ready');
    }
    return notReady;
  }

  updateReady();

  child.stdout.on('data', data => {
    const lines = data.toString().split(/\r?\n/);
    lines.forEach(line => {
      line = line.trim();
      containers.forEach(service => {
        if (service.ready || !service.pattern.test(line)) {
          return;
        }
        service.ready = true;
        const notReady = updateReady();
        if (notReady.length === 0) {
          afterDocker();
        }
      });
    });
  });

  child.on('close', code => {
    process.exit(0);
  });
}

if (process.env.DWS_COMMAND === 'init') {
  dwsInit();
}
