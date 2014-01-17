#!/bin/sh

set -e

BASE_DIR=$(pwd)
APP_NAME=$(basename ${BASE_DIR})
TEMP_DIR=$(mktemp -d /tmp/deploy.XXXX)

echo "Building app and dependencies in ${TEMP_DIR}..."
(cd ${TEMP_DIR} && npm install --quiet ${BASE_DIR}) > build.log 2>&1 \
    || echo "Failed build ${APP_NAME}, see build.log for details"

echo "Packaging app and dependencies..."
tar -C ${TEMP_DIR}/node_modules -czf ${APP_NAME}.tgz ${APP_NAME}

echo "Cleaning up..."
rm -rf ${TEMP_DIR}

echo "Bundled npm package ready: ${APP_NAME}.tgz"
