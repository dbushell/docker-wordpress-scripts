const chalk = require('chalk');
const Listr = require('listr');
const docker = require('./docker');
const {dwsPre} = require('./dws-pre');
const {dwsConfig} = require('./dws-config');
const {dwsInstallWP} = require('./dws-install-wp');
const {dwsURL} = require('./dws-url');

async function dwsUp() {
  // await dwsPre();
  await dwsConfig();

  const {subprocess, emitter} = docker.composeEvents({command: 'up'});

  const mysqlTask = new Listr([
    {
      title: 'container',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/mysql(.+?)(up-to-date|done)$/.test(line)) {
              resolve();
            }
          });
        })
    },
    {
      title: 'service',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/mysql(.+?)mysqld: ready for connections\.$/.test(line)) {
              resolve();
            }
          });
        })
    }
  ]);

  const wordPressTask = new Listr([
    {
      title: 'container',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/wordpress(.+?)(up-to-date|done)/.test(line)) {
              resolve();
            }
          });
        })
    },
    {
      title: 'service',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (
              /wordpress(.*?)Command line: 'apache2 -D FOREGROUND'$/.test(line)
            ) {
              resolve();
            }
          });
        })
    }
  ]);

  const phpMyAdminTask = new Listr([
    {
      title: 'container',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/phpmyadmin(.+?)(up-to-date|done)/.test(line)) {
              resolve();
            }
          });
        })
    },
    {
      title: 'service',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (
              /phpmyadmin(.*?)Command line: 'apache2 -D FOREGROUND'$/.test(line)
            ) {
              resolve();
            }
          });
        })
    }
  ]);

  const list = new Listr(
    [
      {
        title: 'Initiating MySQL',
        task: () => mysqlTask
      },
      {
        title: 'Initiating WordPress',
        task: () => wordPressTask
      },
      {
        title: 'Initiating phpMyAdmin',
        task: () => phpMyAdminTask
      }
    ],
    {
      concurrent: true,
      collapse: false,
      exitOnError: false
    }
  );

  try {
    await list.run();
    await dwsInstallWP();
    console.log(
      `\n🐹 ${chalk.green.bold('Success:')} ${chalk.green(
        'WordPress is up and running!'
      )}`
    );
    dwsURL();
    process.exit(0);
  } catch (err) {}
}

if (process.env.DWS_COMMAND === 'up') {
  dwsUp();
}

module.exports = {dwsUp};
