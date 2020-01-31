const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {prompt} = require('enquirer');
const {dwsPre} = require('./dws-pre');
const {
  appPath,
  appConf,
  setAppConf,
  validateName,
  validateHostName
} = require('./config');

async function dwsConfig() {
  dwsPre();

  const exists = fs.existsSync(path.resolve(appPath, 'wordpress'));

  if (exists) {
    console.log(
      `\n${chalk.yellow.bold(`Project already initiated?`)}\nRun "${chalk.bold(
        'npx dws destroy'
      )}" first to avoid conflicts\n`
    );
  }

  const conf = appConf();

  return new Promise(async (resolve, reject) => {
    try {
      const response = await prompt([
        {
          type: 'input',
          name: 'name',
          initial: conf.name,
          message: 'Project name',
          validate: value => {
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
          validate: value => {
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
          validate: value => value.length && !/^\s+$/.test(value)
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

module.exports = {dwsConfig};
