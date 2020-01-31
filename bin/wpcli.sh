#!/bin/bash

echo "Installing WordPress...";

curl -s -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar;
chmod +x wp-cli.phar;
mv ./wp-cli.phar /usr/local/bin/wp;

wp core install \
    --url=${VIRTUAL_HOST} \
    --title="${WP_TITLE}" \
    --admin_user=${WP_ADMIN_USER} \
    --admin_password=${WP_ADMIN_PASSWORD} \
    --admin_email=${WP_ADMIN_EMAIL} \
    --skip-email \
    --skip-plugins=hello,akismet \
    --allow-root;

wp --allow-root core update;

wp --allow-root theme activate "twentytwenty";

WP_PLUGINS=$(wp --allow-root plugin list --status=inactive --field=name);
[ ! -z "$WP_PLUGINS" ] && wp --allow-root plugin delete $WP_PLUGINS;

WP_THEMES=$(wp --allow-root theme list --status=inactive --field=name);
[ ! -z "$WP_THEMES" ] && wp --allow-root theme delete $WP_THEMES;

wp --allow-root option update permalink_structure /%year%/%monthnum%/%postname%/;

wp --allow-root rewrite flush;
