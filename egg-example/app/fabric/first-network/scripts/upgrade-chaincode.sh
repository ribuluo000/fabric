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

	# upgrade chaincode on peer0.org1 and peer0.org2
	echo "upgradeing chaincode on peer0.org1..."
	upgradeChaincode 0 1 7
	echo "upgradeing chaincode on peer0.org2..."
	upgradeChaincode 0 2 7

	## upgrade chaincode on peer1.org2
	echo "upgradeing chaincode on peer1.org2..."
	upgradeChaincode 1 2 7
	upgradeChaincode 1 1 7

exit 0
