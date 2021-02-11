import EventEmitter from 'events';
import execa from 'execa';
import stripAnsi from 'strip-ansi';
import {appConf, appPath, ownPath, logLine} from './config.js';

function docker(config) {
  const {args, command, env, emitter} = config;

  const subprocess = execa(command, args || [], {
    stdio: 'pipe',
    all: true,
    cwd: ownPath,
    env: env || {}
  });

  if (emitter) {
    subprocess.all.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/);
      lines.forEach((line) => {
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
  let {command: composeCmd, args: composeArgs, env, file, project} = config;

  const conf = appConf();

  if (typeof file !== 'string') {
    file = `${ownPath}/config/docker-compose.yml`;
  }

  if (typeof project !== 'string') {
    project = conf.name;
  }

  if (!env) {
    env = {
      ...conf.env
    };
  }

  const args = ['-p', project, '-f', file, composeCmd, ...(composeArgs || [])];
  const command = 'docker-compose';
  const emitter = new EventEmitter();

  return {
    emitter,
    subprocess: docker({
      ...config,
      command,
      args,
      env,
      emitter
    })
  };
}

function execEvents(config) {
  const {container, env, script} = config;

  const args = ['exec', '-t', ...(env || []), container, script];
  const command = 'docker';
  const emitter = new EventEmitter();

  return {emitter, subprocess: docker({args, emitter, command})};
}

export default {docker, composeEvents, execEvents};
