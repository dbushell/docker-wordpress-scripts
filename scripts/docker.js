const crossSpawn = require('cross-spawn');
const {appPath, appPkg, ownPath, ownPkg} = require('./config');

function compose(command, sync = true) {
  const options = [
    '-p',
    appPkg.name,
    '-f',
    `${ownPath}/config/docker-compose.yml`,
    command
  ];

  const spawn = sync ? crossSpawn.sync : crossSpawn.spawn;

  const docker = spawn(`docker-compose`, options, {
    stdio: sync ? 'inherit' : 'pipe',
    cwd: ownPath,
    env: {
      PATH: process.env.PATH,
      PROJECT_NAME: appPkg.name,
      PROJECT_ROOT: appPath,
      VIRTUAL_HOST: `${appPkg.name}.localhost`
    }
  });

  return docker;
}

module.exports = {
  compose
};
