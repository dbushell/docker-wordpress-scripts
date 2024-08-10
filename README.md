![Docker WordPress Scripts](/.github/dws-logo.svg)

**✨ This project is not under active development. It may not work with the latest Docker. Future DWS updates uncertain at this time. ✨**

* * *

# 🤖 Docker WordPress Scripts

[![npm version](https://badge.fury.io/js/docker-wordpress-scripts.svg)](https://badge.fury.io/js/docker-wordpress-scripts)

DWS is a small set of scripts to manage WordPress containers in Docker. It uses a [Traefik docker network](https://github.com/dbushell/docker-traefik) for `*.localhost` domains to avoid manual port assignment.

**This is work in progress and unstable!**

This is somewhat of a [personal project](https://dbushell.com/2020/02/07/docker-wordpress-portless-localhost-domains/) but it solves a fairly common problem so I'm sharing it for anyone to use and adapt.

## Requirements

* [Docker](https://www.docker.com/) must be installed and running on your machine
* [Traefik docker network](https://github.com/dbushell/docker-traefik)

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
  dws up            spin up a new project
  dws stop          stop running containers
  dws start         start existing containers
  dws url           output the *.localhost URL
  dws down          stop and remove existing containers
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
🤖 Success: WordPress is up and running!
phpMyAdmin: ➜ http://pma.wordpress.localhost
WordPress:  ➜ http://wordpress.localhost
WordPress (auto login):  ➜ http://wordpress.localhost/wp-auto-login.php
```

The `wp-content` directory is mounted to `wordpress` in the project repository.

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

Stop and remove all containers and volumes for the project leaving no trace in Docker. The WordPress content directories will persist in the project repository.

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

## NGINX and Portainer

See [v0.9.1](https://github.com/dbushell/docker-wordpress-scripts/tree/v0.9.1) for older configurations.

* * *

[MIT License](/LICENSE) | Copyright © 2021 [David Bushell](https://dbushell.com)
