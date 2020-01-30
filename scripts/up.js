const init = require('./init');
const docker = require('./docker');

init();

const child = docker.compose('up', false);


child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// child.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  process.exit(0);
});
