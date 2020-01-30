const fs = require('fs');
const path = require('path');

const cwd = fs.realpathSync(process.cwd());
const ownPath = path.resolve(__dirname, '../');
const appPath = path.resolve(cwd, '.');

function loadPkg(pkgPath) {
  try {
    const pkg = require(pkgPath);
    return pkg;
  } catch (err) {
    return {};
  }
}

const ownPkg = loadPkg(path.join(ownPath, 'package.json'));
const appPkg = loadPkg(path.join(appPath, 'package.json'));

module.exports = {
  appPath,
  appPkg,
  ownPath,
  ownPkg
};
