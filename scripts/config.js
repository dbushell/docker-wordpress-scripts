import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import readPkg from 'read-pkg';
import writePkg from 'write-pkg';
import stripAnsi from 'strip-ansi';

const cwd = fs.realpathSync(process.cwd());
const ownPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../'
);
const appPath = path.resolve(cwd, '.');

const ownPkg = () => {
  try {
    return readPkg.sync({cwd: ownPath, normalize: false});
  } catch {
    return {};
  }
};

const appPkg = () => {
  try {
    return readPkg.sync({cwd: appPath, normalize: false});
  } catch {
    return {};
  }
};

const validateName = (value) => /^[\w\d-]+$/.test(value);
const validateHostName = (value) => /^[\w\d-]+.[\w\d-]+$/.test(value);

const logStream = fs.createWriteStream(path.resolve(ownPath, '_dws.log'), {
  flags: 'a'
});

function logLine(line) {
  line = stripAnsi(line).trim();
  if (!line.length || /^\s+$/.test(line)) {
    return '';
  }
  try {
    logStream.write(`[${new Date().toISOString()}] - ${line}\n`);
  } catch (err) {
    // Shrug ...
    console.log(err);
  }
  return line;
}

function appConf(conf) {
  const pkg = appPkg();
  const defaults = {
    name: pkg.name,
    hostname: `${pkg.name}.localhost`,
    title: `WordPress Demo`
  };
  conf = conf || pkg.dws;
  if (typeof conf !== 'object') {
    conf = {};
  }
  conf = {...defaults, ...conf};
  if (!validateName(conf.name)) {
    conf.name = defaults.name;
  }
  if (!validateHostName(conf.hostname)) {
    conf.hostname = defaults.hostname;
  }
  conf.env = {
    PROJECT_ROOT: appPath,
    PROJECT_NAME: conf.name,
    PROJECT_HOST: `${conf.hostname}`,
    WP_TITLE: `${conf.title}`,
    WP_ADMIN_USER: 'admin',
    WP_ADMIN_PASSWORD: 'password',
    WP_ADMIN_EMAIL: `admin@${conf.hostname}`
  };
  return conf;
}

function setAppConf(dws) {
  dws = appConf(dws);
  writePkg.sync(
    appPath,
    {
      ...appPkg(),
      dws: {name: dws.name, hostname: dws.hostname, title: dws.title}
    },
    {normalize: false}
  );
}

export {
  appPath,
  appPkg,
  ownPath,
  ownPkg,
  appConf,
  setAppConf,
  validateName,
  validateHostName,
  logStream,
  logLine
};
