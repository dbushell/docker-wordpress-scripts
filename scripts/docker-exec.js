const fs = require('fs');
const path = require('path');
const cross = require('cross-spawn');
const ora = require('ora');
const {logLine} = require('./config');

const {ownPath, appPath} = require('./config');

function dockerExec(container, script, env) {
  return new Promise((resolve, reject) => {
    const options = ['exec', '-t', ...(env || []), container, script];

    const child = cross.spawn(`docker`, options, {
      stdio: 'pipe',
      cwd: ownPath,
      env: {
        PATH: process.env.PATH
      }
    });

    const spinner = ora();

    child.stdout.on('data', data => {
      const lines = data.toString().split(/\r?\n/);
      lines.forEach(line => {
        line = logLine(line);
        if (!line.length) {
          return;
        }
        const found = line.match(/^\[\d{3}] - (.+?)$/);
        if (found) {
          if (found[1] === '✔') {
            if (spinner.isSpinning) {
              spinner.succeed();
            }
          } else {
            spinner.start(found[1]);
          }
        }
      });
    });

    child.on('close', code => {
      if (code === 0) {
        return resolve(code);
      }
      reject(code);
    });
  });
}

module.exports = dockerExec;
