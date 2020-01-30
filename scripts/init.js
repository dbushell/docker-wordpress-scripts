const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const {appPath, appPkg, ownPath, ownPkg} = require('./config');


/**
 * Test environment variables are set for spawn processes
 */
function testEnv() {
  const testSh = path.resolve(__dirname, '../bin/test-env.sh');
  const testVar = 'HELLOWORLD';
  const testSpawn = spawn.sync(testSh, [], {
    env: {
      TEST_ENV_VAR: testVar
    }
  });
  const testOut = testSpawn.stdout.toString().replace(/[^A-Z]/g, '');
  if (new RegExp(`^${testVar}$`).test(testOut) === false) {
    console.log(chalk.red('Failed testing environment variables'));
    process.exit(1);
  }
}

function init() {
  if ('name' in appPkg === false) {
    console.log(chalk.red('Cannot read project `name` from package.json'));
    process.exit(1);
  }
  console.log(chalk.green(`Project: ${chalk.bold(appPkg.name)}`));
  testEnv();
}

module.exports = init;
