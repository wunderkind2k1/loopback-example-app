#!/bin/sh

BASE=`pwd`
APP_NAME=`basename $BASE`
TARBALL="${APP_NAME}.tgz"

function usage() {
    echo "$0 --to=<server> [--as=<user>] [--port=<PORT>]"
}

function run() {
    to=$1; as=$2; port=$3
    dest=$to
    if [[ -z "$as" ]]; then
        as=`id -un`
    fi
    if [[ -z "$port" ]]; then
        port=22
    fi
    echo "Deploying $TARBALL => $as@$to:$port:/apps/$APP_NAME"
    # ASSUMPTION: Apps are deployed to /apps/<NAME>
    # ASSUMPTION: /apps/<NAME> is writable by deploying user
    cat $TARBALL | ssh -p $port $as@$to tar -C /apps/$APP_NAME --strip-components 1 -xzf -
    # ASSUMPTION: /etc/init/<NAME>.conf is writable by deploying user
    scp -P $port deploy/${APP_NAME}.conf $as@$to:/etc/init/${APP_NAME}.conf
    # ASSUMPTION: deploying user has sudo permission for at least /sbin/initctl
    ssh -p $port $as@$to "sudo /sbin/initctl restart $APP_NAME || \
                          sudo /sbin/initctl start $APP_NAME"
}

if [[ -z "$npm_config_to" ]]; then
    usage
else
    run $npm_config_to $npm_config_as $npm_config_port
fi
