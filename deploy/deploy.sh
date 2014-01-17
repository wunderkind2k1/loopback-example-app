#!/bin/sh

BASE=`pwd`
APP_NAME=`basename $BASE`
TARBALL="${APP_NAME}.tgz"

function do_usage() {
    echo "$0 --to=<server> [--as=<user>] [--port=<PORT>]"
    echo "$0 --check --to=<server> [--as=<user>] [--port=<PORT>]"
}

function do_check() {
    to=$1; as=$2; port=$3

    if [[ -z "$as" ]]; then
        as=`id -un`
    fi
    if [[ -z "$port" ]]; then
        port=22
    fi

    echo "Based on your provided arguments, this script assumes that:"
    grep -e 'ASSUMPTION[:]' $0 | \
        sed -e "s/APP_NAME/$APP_NAME/g" | \
        sed -e "s/DEPLOYER/$as/g" | \
        sed -e "s/.*# ASSUMPTION[:]/ */g"
}

function do_run() {
    to=$1; as=$2; port=$3

    if [[ ! -f "${APP_NAME}.tgz" ]]; then
        echo "${APP_NAME}.tgz not found, please run 'npm run bundle-pack'"
        exit
    fi

    if [[ -z "$as" ]]; then
        as=`id -un`
    fi
    if [[ -z "$port" ]]; then
        port=22
    fi

    echo "Deploying $TARBALL => $as@$to:$port:/apps/$APP_NAME"
    # ASSUMPTION: APP_NAME is deployed to /apps/APP_NAME
    # ASSUMPTION: /apps/APP_NAME is writable by DEPLOYER
    cat $TARBALL | ssh -p $port $as@$to tar -C /apps/$APP_NAME --strip-components 1 -xzf -

    echo "Configuring Upstart job: $APP_NAME"
    # ASSUMPTION: /etc/init/APP_NAME.conf is writable by deploying user
    cat deploy/upstart.conf | \
        sed -e "s/APP_NAME/$APP_NAME/g" | \
        sed -e "s/DEPLOYER/$as/g" | \
        ssh -p $port $as@$to "cat - > /etc/init/${APP_NAME}.conf"

    echo "Reloading/Restarting/Starting Upstart job: $APP_NAME"
    # ASSUMPTION: DEPLOYER has sudo permission to run /sbin/initctl
    ssh -p $port $as@$to "sudo /sbin/initctl reload $APP_NAME; \
                          sudo /sbin/initctl restart $APP_NAME || \
                          sudo /sbin/initctl start $APP_NAME"
}

if [[ -z "$npm_config_to" ]]; then
    do_usage
elif [[ -n "$npm_config_check" ]]; then
    do_check $npm_config_to $npm_config_as $npm_config_port
else
    do_run $npm_config_to $npm_config_as $npm_config_port
fi
