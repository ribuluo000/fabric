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

	## Install chaincode on peer0.org1 and peer0.org2
	echo "Installing chaincode on peer0.org1..."
	installChaincode 0 1
	echo "Install chaincode on peer0.org2..."
	installChaincode 0 2

	## Install chaincode on peer1.org2
	echo "Installing chaincode on peer1.org2..."
	installChaincode 1 2

exit 0
