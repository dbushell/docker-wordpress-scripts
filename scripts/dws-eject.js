const {dwsPre} = require('./dws-pre');

function dwsEject() {
  await dwsPre();
  console.log('The "eject" command is not yet implemented.')
}

if (process.env.DWS_COMMAND === 'eject') {
  dwsEject();
}
