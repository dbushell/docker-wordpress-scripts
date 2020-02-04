const chalk = require('chalk');
const {appConf} = require('./config');

function dwsURL() {
  const conf = appConf();
  console.log(`phpMyAdmin: ${chalk.yellow(`➜ http://pma.${conf.hostname}`)}`);
  console.log(`WordPress:  ${chalk.yellow(`➜ http://${conf.hostname}`)}`);
}

if (process.env.DWS_COMMAND === 'url') {
  dwsURL();
}

module.exports = {dwsURL};
