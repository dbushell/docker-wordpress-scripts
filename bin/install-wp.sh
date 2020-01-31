#!/bin/bash

echo "[001] - Installing WP-CLI";

curl -s -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar;
chmod +x wp-cli.phar;
mv ./wp-cli.phar /usr/local/bin/wp;

echo "[001] - ✔";

echo "[002] - Installing WordPress";

wp core install \
    --url=${PROJECT_HOST} \
    --title="${WP_TITLE}" \
    --admin_user=${WP_ADMIN_USER} \
    --admin_password=${WP_ADMIN_PASSWORD} \
    --admin_email=${WP_ADMIN_EMAIL} \
    --skip-email \
    --skip-plugins=hello,akismet \
    --allow-root;

wp --allow-root option update siteurl ${PROJECT_HOST};
wp --allow-root option update home ${PROJECT_HOST};
wp --allow-root option update blogname "${WP_TITLE}";

echo "[002] - ✔";

echo "[003] - Updating core";

wp --allow-root core update;

echo "[003] - ✔";

echo "[004] - Configuring theme and plugins";

wp --allow-root theme activate "twentytwenty";

WP_PLUGINS=$(wp --allow-root plugin list --status=inactive --field=name);
[ ! -z "$WP_PLUGINS" ] && wp --allow-root plugin delete $WP_PLUGINS;

WP_THEMES=$(wp --allow-root theme list --status=inactive --field=name);
[ ! -z "$WP_THEMES" ] && wp --allow-root theme delete $WP_THEMES;

echo "[004] - ✔";

echo "[005] - Setting permalink structure";

wp --allow-root option update permalink_structure /%year%/%monthnum%/%postname%/;

wp --allow-root rewrite flush;

echo "[005] - ✔";

echo "[000] - ✔";

exit 0;
