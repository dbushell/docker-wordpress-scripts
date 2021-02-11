import Listr from 'listr';
import docker from './docker.js';
import {dwsPre} from './dws-pre.js';
import {ownPath} from './config.js';

async function dwsProxyDown() {
  await dwsPre({isGlobal: true});

  const {subprocess, emitter} = docker.composeEvents({
    command: 'down',
    project: 'dws',
    file: `${ownPath}/config/nginx-compose.yml`
  });

  const tasks = [
    {
      title: 'Removing NGINX',
      task: (ctx) => {
        return new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (/nginx(.+?)done$/.test(line)) {
              ctx.nginx = true;
              resolve();
            }
          });
          subprocess.on('close', (code) => {
            if (!ctx.nginx) {
              reject(new Error('NGINX container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Removing Portainer',
      task: (ctx) => {
        return new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (/portainer(.+?)done$/.test(line)) {
              ctx.portainer = true;
              resolve();
            }
          });
          subprocess.on('close', (code) => {
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

export {dwsProxyDown};
