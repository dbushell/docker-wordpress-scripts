const {dwsPre} = require('./dws-pre');

async function dwsEject() {
  await dwsPre();
  console.log('The "eject" command is not yet implemented.')
}

if (process.env.DWS_COMMAND === 'eject') {
  dwsEject();
}
