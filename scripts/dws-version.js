const {ownPkg} = require('./config');

function dwsVersion() {
  console.log(ownPkg().version);
}

if (process.env.DWS_COMMAND === 'version') {
  dwsVersion();
}

module.exports = {dwsVersion};
