#!/bin/bash

PROJECT_HOST="http://${PROJECT_HOST}";

wp --allow-root option update siteurl ${PROJECT_HOST};
wp --allow-root option update home ${PROJECT_HOST};

echo "[✔EJT]";

exit 0;
