![Docker WordPress Scripts](/.github/dws-logo.svg)

# Docker WordPress Scripts

[![npm version](https://badge.fury.io/js/docker-wordpress-scripts.svg)](https://badge.fury.io/js/docker-wordpress-scripts)

DWS is a small set of scripts to manage WordPress containers in Docker. It uses an [nginx-proxy](https://github.com/jwilder/nginx-proxy/) for `*.localhost` domains to avoid manual port assignment.

**This is work in progress and unstable!**

This is somewhat of a [personal project](https://dbushell.com/2020/02/07/docker-wordpress-portless-localhost-domains/) but it solves a fairly common problem so I'm sharing it for others to use and adapt.

Follow [@dbushell](https://twitter.com/dbushell) for updates and feedback.

## Requirements

* [Docker](https://www.docker.com/) must be installed and running on your machine.
* Port `80` must be unbound for the proxy server to work.

## Install

Run `npm init` if you don't have a `package.json`.

Install `docker-wordpress-scripts` to the project repository:

```sh
npm install docker-wordpress-scripts --save
```

Or use the `--global` flag to use `dws` commands anywhere without `npx`.

## Usage

```
Usage: dws <command> [options]

Commands:
  dws up [proxy]    spin up a new project
  dws stop          stop running containers
  dws start         start existing containers
  dws url           output the *.localhost URL
  dws down [proxy]  stop and remove existing containers
  dws eject         replace DWS dependency with config files

Options:
  --help, -h     Show help
  --version, -v  Show version number
```

### `up`

```sh
npx dws up
```

DWS will spin up new Docker containers and install WordPress. You'll be asked a few configuration values.

Once successful you'll see:

```
🐹 Success: WordPress is up and running!
➜ http://wordpress.localhost
```

The `wp-content` directory is mounted to `wordpress` in the project repository. The entire database is mounted to `_database` (advisable to add to `.gitignore`).

[phpMyAdmin](https://www.phpmyadmin.net/) is also set up on the `pma` subdomain.

Use `dws up --proxy` to spin up the NGINX proxy. This happens automatically when a project is set up.

### `stop`

```sh
npx dws stop
```

Stop all running containers for the project.

### `start`

```sh
npx dws start
```

Start all existing containers for the project.

### `url`
```sh
npx dws url
```

Output the `*.localhost` URL for the project.

### `down`

```sh
npx dws down
```

Stop and remove all containers for the project leaving no trace in Docker. The database and WordPress content directories will persist in the project repository. Unless they are deleted the `init` command can restore the project.

Use `dws down --proxy` to stop and remove the NGINX proxy.

### `eject`

```sh
npx dws eject
```

Remove the DWS dependency. There is no going back! This adds a copy of `docker-compose.yml` and other config files to the project repository. You can continue by using `docker-compose` in the terminal.

The hostname & port for WordPress and phpMyAdmin moves to respectively:

```
localhost:8080
localhost:8081
```

## Using the NGINX Proxy

If you want to set up a reverse proxy without the help of DWS take a look at the [compose files in this directory](https://github.com/dbushell/docker-wordpress-scripts/tree/master/config) and [nginx-proxy](https://github.com/jwilder/nginx-proxy/) by _Jason Wilder_.

The proxy set up by DWS is not exclusive and can be used for other projects. Use the external Docker network `dws_nginx` with `VIRTUAL_HOST` and `VIRTUAL_PORT` environment options for the service.

## Portainer

An instance of [Portainer](https://www.portainer.io/) is also created behind the NGINX proxy. To configure visit:

```
http://portainer.localhost
```

## Credits / License

MIT licensed | Copyright © 2020 [David Bushell](https://dbushell.com) | [@dbushell](https://twitter.com/dbushell)
