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

  VERSION=14
	# upgrade chaincode on peer0.org1 and peer0.org2
	echo "upgradeing chaincode on peer0.org1..."
	upgradeChaincode 0 1 $VERSION
	echo "upgradeing chaincode on peer0.org2..."
	upgradeChaincode 0 2 $VERSION

	## upgrade chaincode on peer1.org2
	echo "upgradeing chaincode on peer1.org2..."
	upgradeChaincode 1 2 $VERSION
	upgradeChaincode 1 1 $VERSION

exit 0
