#!/bin/bash


CHANNEL_NAME="$1"
: ${CHANNEL_NAME:="mychannel"}

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

## Create channel
echo "Creating channel..."
createChannel

exit 0
