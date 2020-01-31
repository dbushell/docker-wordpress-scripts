const init = require('./init');
const docker = require('./docker');
const {logURL} = require('./dws-url');

init();

docker.compose('start');

logURL();
