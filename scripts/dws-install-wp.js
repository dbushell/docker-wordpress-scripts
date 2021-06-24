import Listr from 'listr';
import docker from './docker.js';
import {appConf} from './config.js';

async function dwsInstallWP() {
  const conf = await appConf();

  const container = `${conf.name}_wordpress`;
  const script = 'install-wp.sh';

  let env = [];
  for (let [key, value] of Object.entries(conf.env)) {
    env = env.concat(['-e', `${key}=${value}`]);
  }

  const {subprocess, emitter} = docker.execEvents({container, script, env});

  const tasks = [
    {
      title: 'Installing WP-CLI',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (line === '[✔CLI]') {
              resolve();
            }
          });
        })
    },
    {
      title: 'Installing WordPress',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (line === '[✔IWP]') {
              resolve();
            }
          });
        })
    },
    {
      title: 'Updating core',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (line === '[✔UWP]') {
              resolve();
            }
          });
        })
    },
    {
      title: 'Configuring theme and plugins',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (line === '[✔CTP]') {
              resolve();
            }
          });
        })
    },
    {
      title: 'Setting permalink structure',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (line === '[✔SPS]') {
              resolve();
            }
          });
        })
    }
  ];

  try {
    const list = new Listr(tasks, {exitOnError: false});
    await list.run();
  } catch (err) {
    console.log(err);
  }

  try {
    await subprocess;
  } catch (err) {}
}

if (process.env.DWS_COMMAND === 'install-wp') {
  dwsInstallWP();
}

export {dwsInstallWP};
