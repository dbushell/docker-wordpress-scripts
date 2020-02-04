const Listr = require('listr');
const docker = require('./docker');
const {dwsPre} = require('./dws-pre');

async function dwsDown() {
  await dwsPre();
  const {subprocess, emitter} = docker.composeEvents({command: 'down'});

  const tasks = [
    {
      title: 'Removing MySQL',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/mysql(.+?)done$/.test(line)) {
              ctx.mysql = true;
              resolve();
            }
          });
          subprocess.on('close', code => {
            if (!ctx.mysql) {
              reject(new Error('MySQL container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Removing WordPress',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/wordpress(.+?)done$/.test(line)) {
              ctx.wordpress = true;
              resolve();
            }
          });
          subprocess.on('close', code => {
            if (!ctx.wordpress) {
              reject(new Error('WordPress container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Removing phpMyAdmin',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (/phpmyadmin(.+?)done$/.test(line)) {
              ctx.phpmyadmin = true;
              resolve();
            }
          });
          subprocess.on('close', code => {
            if (!ctx.phpmyadmin) {
              reject(new Error('phpMyAdmin container not initiated'));
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

if (process.env.DWS_COMMAND === 'down') {
  dwsDown();
}

module.exports = {dwsDown};
