const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const stripAnsi = require('strip-ansi');
const execa = require('execa');
const {appConf, appPath, ownPath, logLine} = require('./config');

function compose(config) {
  let {command, env, file, project, sync, emitter} = config;

  const conf = appConf();
  if (typeof file !== 'String') {
    file = `${ownPath}/config/docker-compose.yml`;
  }
  if (typeof project !== 'String') {
    project = conf.name;
  }

  const args = ['-p', project, '-f', file, command];

  if (!env) {
    env = {
      PROJECT_ROOT: appPath,
      PROJECT_NAME: conf.name,
      PROJECT_HOST: conf.hostname
    };
  }

  const subprocess = execa(`docker-compose`, args, {
    stdio: 'pipe',
    all: true,
    cwd: ownPath,
    env: env
  });

  if (emitter) {
    subprocess.all.on('data', data => {
      const lines = data.toString().split(/\r?\n/);
      lines.forEach(line => {
        line = stripAnsi(line).trim();
        if (!line.length || /^\s+$/.test(line)) {
          return '';
        }
        logLine(line);
        emitter.emit('line', line);
      });
    });
  }

  return subprocess;
}

function composeEvents(config) {
  const emitter = new EventEmitter();
  return {emitter, subprocess: compose({...config, emitter})};
}

module.exports = {
  compose,
  composeEvents
};
