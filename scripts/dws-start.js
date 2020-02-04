const Listr = require('listr');
const docker = require('./docker');
const {dwsPre} = require('./dws-pre');
const {dwsURL} = require('./dws-url');

async function dwsStart() {
  await dwsPre();

  const {subprocess, emitter} = docker.composeEvents({command: 'start'});

  const tasks = [
    {
      title: 'Starting Database',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (ctx.mysql) {
              return;
            }
            if (/mysql(.+?)done$/.test(line)) {
              ctx.mysql = true;
              resolve();
            }
            if (/mysql(.+?)failed$/.test(line)) {
              ctx.mysql = true;
              reject(new Error('Database container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Starting WordPress',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (ctx.wordpress) {
              return;
            }
            if (/wordpress(.+?)done$/.test(line)) {
              ctx.wordpress = true;
              resolve();
            }
            if (/wordpress(.+?)failed$/.test(line)) {
              ctx.wordpress = true;
              reject(new Error('WordPress container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Starting phpMyAdmin',
      task: ctx => {
        return new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (ctx.phpmyadmin) {
              return;
            }
            if (/phpmyadmin(.+?)done$/.test(line)) {
              ctx.phpmyadmin = true;
              resolve();
            }
            if (/wordpress(.+?)failed$/.test(line)) {
              ctx.phpmyadmin = true;
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
    dwsURL();
  } catch (err) {}
}

if (process.env.DWS_COMMAND === 'start') {
  dwsStart();
}

module.exports = {dwsStart};
