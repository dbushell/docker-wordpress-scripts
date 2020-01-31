const fs = require('fs');
const path = require('path');
const cross = require('cross-spawn');
const stripAnsi = require('strip-ansi');
const ora = require('ora');

const {ownPath, appPath} = require('./config');

function dockerExec(container, script, env) {
  return new Promise((resolve, reject) => {
    const log = fs.createWriteStream(path.resolve(appPath, 'docker.log'), {
      flags: 'a'
    });

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
        line = stripAnsi(line).trim();
        if (!line.length || /^\s+$/.test(line)) {
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
        } else {
          log.write(`[${new Date().toISOString()}] - ${line}\n`);
        }
      });
    });

    child.on('close', code => {
      log.end();
      if (code === 0) {
        return resolve(code);
      }
      reject(code);
    });
  });
}

module.exports = dockerExec;
