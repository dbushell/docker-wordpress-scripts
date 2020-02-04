const EventEmitter = require('events');
const execa = require('execa');
const stripAnsi = require('strip-ansi');
const {appConf, appPath, ownPath, logLine} = require('./config');

function docker(config) {
  const {args, command, env, emitter} = config;

  const subprocess = execa(command, args || [], {
    stdio: 'pipe',
    all: true,
    cwd: ownPath,
    env: env || {}
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
  let {command: composeCmd, env, file, project} = config;

  const conf = appConf();

  if (typeof file !== 'string') {
    file = `${ownPath}/config/docker-compose.yml`;
  }

  if (typeof project !== 'string') {
    project = conf.name;
  }

  if (!env) {
    env = {
      PROJECT_ROOT: appPath,
      PROJECT_NAME: conf.name,
      PROJECT_HOST: conf.hostname
    };
  }

  const args = ['-p', project, '-f', file, composeCmd];
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

module.exports = {
  docker,
  composeEvents,
  execEvents
};
