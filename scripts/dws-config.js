import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import enquirer from 'enquirer';
import {dwsPre} from './dws-pre.js';
import {
  appPath,
  appConf,
  setAppConf,
  validateName,
  validateHostName
} from './config.js';

async function dwsConfig() {
  await dwsPre();

  const exists = fs.existsSync(path.resolve(appPath, 'wordpress'));

  if (exists) {
    console.log(chalk.red.bold(`⚡ Project already initialised?`));
    console.log(
      `Run '${chalk.bold('npx dws down')}' first to avoid conflicts\n`
    );
  }

  const conf = appConf();

  return new Promise(async (resolve, reject) => {
    try {
      const response = await enquirer.prompt([
        {
          type: 'input',
          name: 'name',
          initial: conf.name,
          message: 'Project name',
          validate: (value) => {
            if (!validateName(value)) {
              return 'Project name can only contain letters, numbers, hyphens, and underscores';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'hostname',
          initial: conf.hostname,
          message: 'Project hostname',
          validate: (value) => {
            if (!validateHostName(value)) {
              return 'Project hostname can only contain letters, numbers, hyphens, and underscores';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'title',
          initial: conf.title,
          message: 'Blog name',
          validate: (value) => value.length && !/^\s+$/.test(value)
        }
      ]);

      setAppConf(response);
      resolve();
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });
}

if (process.env.DWS_COMMAND === 'config') {
  async function run() {
    await dwsConfig();
  }
  run();
}

export {dwsConfig};
