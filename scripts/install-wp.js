const dockerExec = require('./docker-exec');
const {appPkg} = require('./config');

async function installWP() {
  let env = [
    'WP_TITLE="Demo One"',
    'WP_ADMIN_USER=admin',
    'WP_ADMIN_PASSWORD=password',
    'WP_ADMIN_EMAIL=hello@example.com'
  ];

  env = env.reduce((e, v) => e.concat(['-e', v]), []);

  const container = `${appPkg.name}_wordpress_1`;
  const script = 'install-wp.sh';

  await dockerExec(container, script, env);
}

module.exports = installWP;
