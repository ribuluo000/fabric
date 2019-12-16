#!/bin/bash


CHANNEL_NAME="$1"
LANGUAGE="$3"
: ${CHANNEL_NAME:="mychannel"}
: ${LANGUAGE:="node"}

echo "Channel name : "$CHANNEL_NAME
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/chaincode_example02/node/"
echo $CC_SRC_PATH
echo $LANGUAGE
# import utils
. scripts/utils.sh

	# Instantiate chaincode on peer0.org2
	echo "Instantiating chaincode on peer0.org2..."
	instantiateChaincode 0 2

exit 0
