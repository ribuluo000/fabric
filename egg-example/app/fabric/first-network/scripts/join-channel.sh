#!/bin/bash


CHANNEL_NAME="$1"
: ${CHANNEL_NAME:="mychannel"}

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

## Join all the peers to the channel
echo "Having all peers join the channel..."$CHANNEL_NAME
joinChannel

exit 0
