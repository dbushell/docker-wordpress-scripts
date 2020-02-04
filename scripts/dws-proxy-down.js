const chalk = require('chalk');
const Listr = require('listr');
const docker = require('./docker');
const {dwsPre} = require('./dws-pre');
const {ownPath} = require('./config');

async function dwsProxyDown() {
  await dwsPre();

  const {subprocess, emitter} = docker.composeEvents({
    command: 'down',
    project: 'dws',
    file: `${ownPath}/config/nginx-compose.yml`
  });

  const tasks = [
    {
      title: 'Removing NGINX',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/nginx(.+?)done$/.test(line)) {
              ctx.nginx = true;
              resolve();
            }
          });
          subprocess.on('close', code => {
            if (!ctx.nginx) {
              reject(new Error('NGINX container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Removing Portainer',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/portainer(.+?)done$/.test(line)) {
              ctx.portainer = true;
              resolve();
            }
          });
          subprocess.on('close', code => {
            if (!ctx.portainer) {
              reject(new Error('Portainer container not initiated'));
            }
          });
        });
      }
    }
  ];

  try {
    const list = new Listr(tasks, {concurrent: true, exitOnError: false});
    await list.run();
  } catch (err) {}

  try {
    await subprocess;
  } catch (err) {}
}

if (process.env.DWS_COMMAND === 'proxy-down') {
  dwsProxyDown();
}

module.exports = {dwsProxyDown};
