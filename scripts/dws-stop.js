const docker = require('./docker');
const {dwsPre} = require('./dws-pre');

function dwsStop() {
  dwsPre();
  docker.compose('stop');
}

if (process.env.DWS_COMMAND === 'stop') {
  dwsStop();
}
