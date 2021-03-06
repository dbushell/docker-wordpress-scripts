import chalk from 'chalk';
import {appConf} from './config.js';

async function dwsURL() {
  const conf = await appConf();
  console.log(`phpMyAdmin: ${chalk.yellow(`➜ http://pma.${conf.hostname}`)}`);
  console.log(`WordPress:  ${chalk.yellow(`➜ http://${conf.hostname}`)}`);
  console.log(
    `Auto login: ${chalk.yellow(`➜ http://${conf.hostname}`)}/wp-auto-login.php`
  );
}

if (process.env.DWS_COMMAND === 'url') {
  dwsURL();
}

export {dwsURL};
