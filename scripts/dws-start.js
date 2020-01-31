const docker = require('./docker');
const {dwsPre} = require('./dws-pre');
const {dwsURL} = require('./dws-url');

function dwsStart() {
  dwsPre();
  docker.compose('start');
  dwsURL();
}

if (process.env.DWS_COMMAND === 'start') {
  dwsStart();
}
