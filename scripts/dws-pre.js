import path from 'path';
import chalk from 'chalk';
import execa from 'execa';
import {ownPath, appPkg, ownPkg} from './config.js';

async function testEnv() {
  const testSh = path.resolve(ownPath, 'bin/test-env.sh');
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

async function dwsPre({isGlobal} = {}) {
  const pkg = appPkg();
  if (!isGlobal && 'name' in pkg === false) {
    console.log(chalk.red('Cannot read project `name` from package.json'));
    process.exit(1);
  }
  await testEnv();
}

export {dwsPre};
