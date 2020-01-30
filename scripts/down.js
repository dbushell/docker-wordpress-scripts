const init = require('./init');
const docker = require('./docker');

init();

docker.compose('down');
