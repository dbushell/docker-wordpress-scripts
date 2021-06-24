import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import Listr from 'listr';
import docker from './docker.js';
import {appPath, ownPath, appConf} from './config.js';
import {dwsStart} from './dws-start.js';
import {dwsDown} from './dws-down.js';

async function dwsEject() {
  await dwsStart();
  const conf = await appConf();

  const {subprocess, emitter} = docker.execEvents({
    container: `${conf.name}_wordpress`,
    script: 'eject-wp.sh',
    env: ['-e', 'PROJECT_HOST=localhost:8080']
  });

  const tasks = [
    {
      title: 'Updating WordPress URL options',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', (line) => {
            if (line === '[✔EJT]') {
              resolve();
            }
          });
        })
    }
  ];

  const list = new Listr(tasks, {exitOnError: false});
  await list.run();

  await subprocess;

  await dwsDown({eject: true});

  let composeFile = fs
    .readFileSync(path.resolve(ownPath, 'config/eject-docker-compose.yml'))
    .toString();

  const env = {...conf.env};
  env.PROJECT_ROOT = '.';
  for (let [key, value] of Object.entries(env)) {
    composeFile = composeFile.replace(new RegExp(`\\\${${key}}`, 'g'), value);
  }

  fs.writeFileSync(path.resolve(appPath, 'docker-compose.yml'), composeFile);

  console.log(`  ${chalk.bold.green(`✔`)} Writing new Docker compose file`);

  fs.copyFileSync(
    path.resolve(ownPath, 'config/php.conf.ini'),
    path.resolve(appPath, 'php.conf.ini')
  );

  console.log(`  ${chalk.bold.green(`✔`)} Copying PHP config file`);

  console.log(
    `\n🚀 ${chalk.green.bold('Ejected!')} Use '${chalk.bold(
      'docker-compose'
    )}' for manual control`
  );
}

if (process.env.DWS_COMMAND === 'eject') {
  try {
    dwsEject();
  } catch (err) {
    console.log(err);
  }
}
