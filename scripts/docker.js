const cross = require('cross-spawn');
const {appConf, appPath, ownPath} = require('./config');

function compose(command, sync = true) {
  const conf = appConf();
  const options = [
    '-p',
    conf.name,
    '-f',
    `${ownPath}/config/docker-compose.yml`,
    command
  ];

  const spawn = sync ? cross.sync : cross.spawn;

  const docker = spawn(`docker-compose`, options, {
    stdio: sync ? 'inherit' : 'pipe',
    cwd: ownPath,
    env: {
      PATH: process.env.PATH,
      PROJECT_ROOT: appPath,
      PROJECT_NAME: conf.name,
      PROJECT_HOST: conf.hostname
    }
  });

  return docker;
}

module.exports = {
  compose
};
