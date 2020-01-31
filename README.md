# Docker WordPress Scripts

DWS is a small set of scripts to manage WordPress containers in Docker. It uses an NGINX proxy for `*.localhost` domains to avoid manual port assignment.

This is **work in progress** and **unstable**!

Follow [@dbushell](https://twitter.com/dbushell) for updates.

## Requirements

[Docker](https://www.docker.com/) must be installed and running on your machine.

Port `80` must be unbound for the proxy server to use.

## Usage

Run `npm init` if you don't have a `package.json`.

Install `docker-wordpress-scripts` to your project directory:

```sh
npm install docker-wordpress-scripts --save
```

By default DWS will use your package name for container/domain names:

```json
{
  "name": "wpdemo"
}
```

```sh
npx dws
```

Show list of commands.

### init

```sh
npx dws init
```

DWS will spin up new docker containers and install WordPress.

Once successful you'll see:

```
🐵 Success: WordPress is up and running!
➜ http://wordpress.localhost
```

### stop

```sh
npx dws stop
```

Stop all running containers for this project.

### start

```sh
npx dws start
```

Start all existing containers for this project.

### url
```sh
npx dws url
```

Output the `*.localhost` URL for this project.

### destroy

```sh
npx dws destroy
```

Stop and remove all containers for this project leaving no trace in Docker. The database and WordPress content directories will persist in your repo. Unless delete, the `init` command can restore the project.

### eject

```sh
npx dws eject
```

Remove the DWS dependency. There is no going back! This adds a copy of `docker-compose.yml` and other config files to your project directory. You can continue by using `docker-compose` in the terminal.

# Configuration

Coming soon...

## Credits / License

MIT licensed | Copyright © 2020 [David Bushell](https://dbushell.com) | [@dbushell](https://twitter.com/dbushell)
