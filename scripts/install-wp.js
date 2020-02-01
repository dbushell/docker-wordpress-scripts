const dockerExec = require('./docker-exec');
const {appConf} = require('./config');

async function installWP() {
  const conf = appConf();

  let env = [
    `PROJECT_HOST=http://${conf.hostname}`,
    `WP_TITLE=${conf.title}`,
    'WP_ADMIN_USER=admin',
    'WP_ADMIN_PASSWORD=password',
    'WP_ADMIN_EMAIL=hello@example.com'
  ];

  env = env.reduce((e, v) => e.concat(['-e', v]), []);

  const container = `${conf.name}_wordpress`;
  const script = 'install-wp.sh';

  await dockerExec(container, script, env);
}

module.exports = installWP;
