const path = require('path');
const chalk = require('chalk');
const cross = require('cross-spawn');
const {appPkg} = require('./config');

function testEnv() {
  const testSh = path.resolve(__dirname, '../bin/test-env.sh');
  const testVar = 'HELLOWORLD';
  const testSpawn = cross.sync(testSh, [], {
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

function dwsPre() {
  const pkg = appPkg();
  if ('name' in pkg === false) {
    console.log(chalk.red('Cannot read project `name` from package.json'));
    process.exit(1);
  }
  testEnv();
}

module.exports = {dwsPre};
