const chalk = require('chalk');
const {appPkg} = require('./config');

function logURL() {
  console.log(chalk.yellow(`➜ http://${appPkg.name}.localhost`));
}

if (process.env.DWS_COMMAND === 'url') {
  logURL();
}

module.exports = {logURL};
