import chalk from 'chalk';
import Listr from 'listr';
import enquirer from 'enquirer';
import docker from './docker.js';
import {dwsPre} from './dws-pre.js';

async function dwsDown(options = {}) {
  await dwsPre();

  console.log(chalk.red.bold(`⚡ This will stop and remove all containers`));
  let response = false;
  const promp = new enquirer.Confirm({
    message: 'Are you sure?'
  });
  try {
    response = await promp.run();
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
  if (response !== true) {
    process.exit(0);
  }

  const {subprocess, emitter} = await docker.composeEvents({
    command: 'down',
    args: options.eject ? [] : ['-v']
  });

  const tasks = [
    {
      title: 'Removing Database',
      task: (ctx) => {
        return new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (/mysql(.+?)done$/.test(line)) {
              ctx.mysql = true;
              resolve();
            }
          });
          subprocess.on('close', (code) => {
            if (!ctx.mysql) {
              reject(new Error('Database container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Removing WordPress',
      task: (ctx) => {
        return new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (/wordpress(.+?)done$/.test(line)) {
              ctx.wordpress = true;
              resolve();
            }
          });
          subprocess.on('close', (code) => {
            if (!ctx.wordpress) {
              reject(new Error('WordPress container not initiated'));
            }
          });
        });
      }
    },
    {
      title: 'Removing phpMyAdmin',
      task: (ctx) => {
        return new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (/phpmyadmin(.+?)done$/.test(line)) {
              ctx.phpmyadmin = true;
              resolve();
            }
          });
          subprocess.on('close', (code) => {
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

export {dwsDown};
