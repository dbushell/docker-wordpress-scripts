#!/bin/bash

# Print a trace of simple commands ...
# set -x;
# Treat unset variables and parameters [...] as an error when performing parameter expansion...
set -u;
# Exit immediately if a pipeline, which may consist of a single simple command, a list, or a compound command returns a non-zero status...
# set -e;

# Each variable or function that is created or modified is given the export attribute and marked for export to the environment of subsequent commands.
set -a;
# Set project root directory
ROOT=$(pwd -P);
cd ${ROOT};

# Set environment variables
source ${ROOT}/.env;

PROJECT_ROOT=${ROOT};

set +a;

# Validate the command
[ -z "${1:-}" ] && usage;

COMMAND="${1}"; shift;
case "${COMMAND}" in

  up)
    # mkdir -p "${ROOT}/wordpress";
    # touch "${ROOT}/wordpress/wp-config.php";
    docker-compose -p $PROJECT_NAME -f ${ROOT}/docker-compose.yml up;
    ;;

  down)
    docker-compose -p $PROJECT_NAME -f ${ROOT}/docker-compose.yml down;
    ;;

  *)
    usage
    ;;
esac;

echo "";
