const chalk = require('chalk');
const Listr = require('listr');
const docker = require('./docker');
const {dwsPre} = require('./dws-pre');
const {ownPath} = require('./config');

async function dwsProxyUp() {
  await dwsPre();

  const {subprocess, emitter} = docker.composeEvents({
    command: 'up',
    project: 'dws',
    file: `${ownPath}/config/nginx-compose.yml`
  });

  const list = new Listr(
    [
      {
        title: 'Initiating NGINX',
        task: () =>
          new Promise((resolve, reject) => {
            emitter.on('line', line => {
              if (/nginx(.+?)(up-to-date|done)$/.test(line)) {
                resolve();
              }
            });
          })
      },
      {
        title: 'Initiating Portainer',
        task: () =>
          new Promise((resolve, reject) => {
            emitter.on('line', line => {
              if (/portainer(.+?)(up-to-date|done)$/.test(line)) {
                resolve();
              }
            });
          })
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
  } catch (err) {}
}

if (process.env.DWS_COMMAND === 'proxy-up') {
  const run = async () => {
    await dwsProxyUp();
    console.log(
      `\n🐹 ${chalk.green.bold('Success:')} ${chalk.green(
        'NGINX proxy ready!'
      )}`
    );
    process.exit(0);
  };
  run();
}

module.exports = {dwsProxyUp};
