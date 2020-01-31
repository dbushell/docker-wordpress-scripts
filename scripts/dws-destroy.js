const {dwsPre} = require('./dws-pre');
const docker = require('./docker');

function dwsDestroy() {
  dwsPre();
  docker.compose('down');
}

if (process.env.DWS_COMMAND === 'destroy') {
  dwsDestroy();
}
