const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const docker = require('./docker');
const {appPath, ownPath, appConf} = require('./config');
const {dwsStart} = require('./dws-start');
const {dwsDown} = require('./dws-down');

async function dwsEject() {
  await dwsStart();
  await dwsDown();
  const conf = appConf();

  const container = `${conf.name}_wordpress`;
  const script = 'eject-wp.sh';

  const execEnv = ['-e', 'PROJECT_HOST=http://localhost:8080'];

  const {subprocess, emitter} = docker.execEvents({container, script, execEnv});

  const tasks = [
    {
      title: 'Updating WordPress URL options',
      task: () =>
        new Promise((resolve, reject) => {
          emitter.on('line', line => {
            if (line === '[✔EJT]') {
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

  await subprocess;

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
