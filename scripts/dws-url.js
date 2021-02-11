import chalk from 'chalk';
import {appConf} from './config.js';

function dwsURL() {
  const conf = appConf();
  console.log(`phpMyAdmin: ${chalk.yellow(`➜ http://pma.${conf.hostname}`)}`);
  console.log(`WordPress:  ${chalk.yellow(`➜ http://${conf.hostname}`)}`);
}

if (process.env.DWS_COMMAND === 'url') {
  dwsURL();
}

export {dwsURL};
