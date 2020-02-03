const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const {appPkg} = require('./config');

async function testEnv() {
  const testSh = path.resolve(__dirname, '../bin/test-env.sh');
  const testVar = 'HELLOWORLD';
  const {stdout: testOut} = await execa(testSh, [], {
    env: {
      TEST_ENV_VAR: testVar
    }
  });
  if (new RegExp(`^${testVar}$`).test(testOut) === false) {
    console.log(chalk.red('Failed testing environment variables'));
    process.exit(1);
  }
}

async function dwsPre() {
  const pkg = appPkg();
  if ('name' in pkg === false) {
    console.log(chalk.red('Cannot read project `name` from package.json'));
    process.exit(1);
  }
  await testEnv();
}

module.exports = {dwsPre};
