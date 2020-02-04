const Listr = require('listr');
const docker = require('./docker');
const {appConf} = require('./config');

async function dwsInstallWP() {
  const conf = appConf();

  let env = [
    `PROJECT_HOST=http://${conf.hostname}`,
    `WP_TITLE=${conf.title}`,
    'WP_ADMIN_USER=admin',
    'WP_ADMIN_PASSWORD=password',
    'WP_ADMIN_EMAIL=hello@example.com'
  ];

  env = env.reduce((e, v) => e.concat(['-e', v]), []);

  const container = `${conf.name}_wordpress`;
  const script = 'install-wp.sh';

  const {subprocess, emitter} = docker.execEvents({container, script, env});

  const tasks = [
    {
      title: 'Installing WP-CLI',
      task: () => new Promise((resolve, reject) => {
        emitter.on('line', line => {
          if (line === '[✔CLI]') {
            resolve();
          }
        });
      })
    },
    {
      title: 'Installing WordPress',
      task: () => new Promise((resolve, reject) => {
        emitter.on('line', line => {
          if (line === '[✔IWP]') {
            resolve();
          }
        });
      })
    },
    {
      title: 'Updating core',
      task: () => new Promise((resolve, reject) => {
        emitter.on('line', line => {
          if (line === '[✔UWP]') {
            resolve();
          }
        });
      })
    },
    {
      title: 'Configuring theme and plugins',
      task: () => new Promise((resolve, reject) => {
        emitter.on('line', line => {
          if (line === '[✔CTP]') {
            resolve();
          }
        });
      })
    },
    {
      title: 'Setting permalink structure',
      task: () => new Promise((resolve, reject) => {
        emitter.on('line', line => {
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
  } catch (err) {console.log(err)}

  try {
    await subprocess;
  } catch (err) {}
}

if (process.env.DWS_COMMAND === 'install-wp') {
  dwsInstallWP();
}

module.exports = {dwsInstallWP};
