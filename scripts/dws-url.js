const chalk = require('chalk');
const {appConf} = require('./config');

function dwsURL() {
  const conf = appConf();
  console.log(chalk.yellow(`➜ http://${conf.hostname}`));
}

if (process.env.DWS_COMMAND === 'url') {
  dwsURL();
}

module.exports = {dwsURL};
