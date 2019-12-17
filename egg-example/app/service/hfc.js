const Service = require('egg').Service;

var hfc = require('fabric-client');
var path = require('path');
var util = require('util');
var sdkUtils = require('fabric-client/lib/utils')
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('hfc');
const fs = require('fs');

const getKeyFilesInDir = (dir) => {
  //该函数用于找到keystore目录下的私钥文件的路径 
  const files = fs.readdirSync(dir)
  const keyFiles = []
  files.forEach((file_name) => {
    let filePath = path.join(dir, file_name)
    if (file_name.endsWith('_sk')) {
      keyFiles.push(filePath)
    }
  })
  return keyFiles
}

var options = {
  user_id: 'Admin@org1.example.com',
  msp_id: 'Org1MSP',
  channel_id: 'mychannel395',
  chaincode_id: 'mycc',
  peer_url: 'grpcs://localhost:7051',//因为启用了TLS，所以是grpcs,如果没有启用TLS，那么就是grpc 
  event_url: 'grpcs://localhost:7053',//因为启用了TLS，所以是grpcs,如果没有启用TLS，那么就是grpc 
  orderer_url: 'grpcs://localhost:7050',//因为启用了TLS，所以是grpcs,如果没有启用TLS，那么就是grpc 
  privateKeyFolder: '/Users/nick/Downloads/tmp/fab/fabric144/fabric-test/egg-example/app/fabric/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore',
  signedCert: '/Users/nick/Downloads/tmp/fab/fabric144/fabric-test/egg-example/app/fabric/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem',
  peer_tls_cacerts: '/Users/nick/Downloads/tmp/fab/fabric144/fabric-test/egg-example/app/fabric/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt',
  orderer_tls_cacerts: '/Users/nick/Downloads/tmp/fab/fabric144/fabric-test/egg-example/app/fabric/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt',
  server_hostname: "peer0.org1.example.com"
};

class HfcService extends Service {

  //query
  async getClient() {
    var channel = {};
    var client = null;
    var targets = [];
    var tx_id = null;
    logger.info("Load privateKey and signedCert");
    client = new hfc();
    var createUserOpt = {
      username: options.user_id,
      mspid: options.msp_id,
      cryptoContent: {
        privateKey: getKeyFilesInDir(options.privateKeyFolder)[0],
        signedCert: options.signedCert
      }
    }
    logger.info("createUserOpt", createUserOpt);

    //以上代码指定了当前用户的私钥，证书等基本信息 
    const store = await sdkUtils.newKeyValueStore({
      path: "/tmp/fabric-client-stateStore/"
    });
    logger.info("store", store);

    client.setStateStore(store)
    const user = await client.createUser(createUserOpt)


    channel = client.newChannel(options.channel_id);
    let data = fs.readFileSync(options.peer_tls_cacerts);
    logger.info("data", data.toString());

    let peer = client.newPeer(options.peer_url,
      {
        pem: Buffer.from(data).toString(),
        'ssl-target-name-override': options.server_hostname,
      }
    );
    //因为启用了TLS，所以上面的代码就是指定Peer的TLS的CA证书 
    channel.addPeer(peer);
    //接下来连接Orderer的时候也启用了TLS，也是同样的处理方法 
    let odata = fs.readFileSync(options.orderer_tls_cacerts);
    logger.info("odata", odata.toString());

    let caroots = Buffer.from(odata).toString();
    logger.info("caroots", caroots);

    var orderer = client.newOrderer(options.orderer_url, {
      'pem': caroots,
      'ssl-target-name-override': "orderer.example.com"
    });

    channel.addOrderer(orderer);
    targets.push(peer);

    return { client, options, channel, targets };
  }

  getSendTransactionProposalResponse(results) {

    var proposalResponses = results[0];
    var proposal = results[1];
    var header = results[2];
    let isProposalGood = false;
    let data = false;
    if (proposalResponses && proposalResponses[0].response &&
      proposalResponses[0].response.status === 200) {
      isProposalGood = true;
      console.log('transaction proposal was good');
    } else {
      console.error('transaction proposal was bad');
    }
    if (isProposalGood) {
      console.log(util.format(
        'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
        proposalResponses[0].response.status, proposalResponses[0].response.message,
        proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
      data = proposalResponses[0].response;
      return data;
    } else {
      console.error(
        'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
      );
      return false;
    }

  }

  getTransactionRequestBySendTransactionProposalResults(results, tx_id) {

    var proposalResponses = results[0];
    var proposal = results[1];
    var header = results[2];
    let isProposalGood = false;
    let data = false;
    if (proposalResponses && proposalResponses[0].response &&
      proposalResponses[0].response.status === 200) {
      isProposalGood = true;
      console.log('transaction proposal was good');
    } else {
      console.error('transaction proposal was bad');
    }
    if (isProposalGood) {
      console.log(util.format(
        'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
        proposalResponses[0].response.status, proposalResponses[0].response.message,
        proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));

      var request = {
        txId: tx_id,
        proposalResponses: proposalResponses,
        proposal: proposal,
        header: header
      };
      logger.info("request", request);

      return request;
    } else {
      console.error(
        'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
      );
      return false;
    }

  }

  //invoke
  async query(_request) {
    let data = '';
    const { client, options, channel } = await this.getClient();
    const tx_id = client.newTransactionID();
    logger.info("tx_id", tx_id);
    logger.info("tx_id._transaction_id", tx_id._transaction_id);

    //查询余额
    var request = {
      chaincodeId: options.chaincode_id,
      txId: tx_id,
      ..._request,
    };
    logger.info("request", request);

    const results = await channel.sendTransactionProposal(request);
    const response = await this.getSendTransactionProposalResponse(results);
    data = response.payload;
    return data;

  }

  //invoke
  async sendTransaction(_request) {
    const { client, options, channel, targets } = await this.getClient();

    const tx_id = client.newTransactionID();
    const tx_id_string = tx_id.getTransactionID();
    logger.info("tx_id", tx_id);
    logger.info("tx_id._transaction_id", tx_id._transaction_id);

    //发起转账行为，将a->b 10元 
    var request = {
      targets: targets,
      chaincodeId: options.chaincode_id,
      // fcn: 'invoke',
      // args: ['a', 'b', '10'],
      chainId: options.channel_id,
      txId: tx_id,
      ..._request,
    };
    logger.info("request", request);
    const peers = channel.getChannelPeers();
    // logger.info("peers", peers);
    peers.forEach((item, i) => {
      logger.info("peers name", item.getPeer().getName());

    })

    // return peers;

    const results = await channel.sendTransactionProposal(request);
    // logger.info("results", results);

    const transactionRequest = await this.getTransactionRequestBySendTransactionProposalResults(results, tx_id);
    // logger.info("transactionRequest", transactionRequest);

    if (transactionRequest) {
      logger.info("transactionRequest111111", transactionRequest);


      // wait for the channel-based event hub to tell us
      // that the commit was good or bad on each peer in our organization
      const promises = [];
      let event_hubs = channel.getChannelEventHubsForOrg();
      logger.info("event_hubs", event_hubs);

      event_hubs.forEach((eh) => {
        logger.info('invokeEventPromise - setting up event');
        let invokeEventPromise = new Promise((resolve, reject) => {
          let event_timeout = setTimeout(() => {
            let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
            logger.info(message);
            eh.disconnect();
          }, 3000);
          eh.registerTxEvent(tx_id_string, (tx, code, block_num) => {
            logger.info('The chaincode invoke chaincode transaction has been committed on peer %s', eh.getPeerAddr());
            logger.info('Transaction %s has status of %s in blocl %s', tx, code, block_num);
            clearTimeout(event_timeout);

            if (code !== 'VALID') {
              let message = util.format('The invoke chaincode transaction was invalid, code:%s', code);
              logger.info(message);
              reject(new Error(message));
            } else {
              let message = 'The invoke chaincode transaction was valid.';
              logger.info(message);
              resolve(message);
            }
          }, (err) => {
            clearTimeout(event_timeout);
            logger.info(err);
            reject(err);
          },
            // the default for 'unregister' is true for transaction listeners
            // so no real need to set here, however for 'disconnect'
            // the default is false as most event hubs are long running
            // in this use case we are using it only once
            { unregister: true, disconnect: true }
          );
          eh.connect();
        });
        promises.push(invokeEventPromise);
      });

      const orderer_request = transactionRequest;
      const sendPromise = channel.sendTransaction(transactionRequest);
      // put the send to the orderer last so that the events get registered and
      // are ready for the orderering and committing
      promises.push(sendPromise);
      logger.info("promises.length", promises.length);
      let results = await Promise.all(promises);
      logger.info(util.format('------->>> R E S P O N S E : %j', results));
      let response = results.pop(); //  orderer results are last in the results
      if (response.status === 'SUCCESS') {
        logger.info('Successfully sent transaction to the orderer.');
      } else {
        error_message = util.format('Failed to order the transaction. Error code: %s', response.status);
        logger.info(error_message);
      }

      // now see what each of the event hubs reported
      for (let i in results) {
        let event_hub_result = results[i];
        let event_hub = event_hubs[i];
        logger.info('Event results for event hub :%s', event_hub.getPeerAddr());
        if (typeof event_hub_result === 'string') {
          logger.info(event_hub_result);
        } else {
          if (!error_message) error_message = event_hub_result.toString();
          logger.info(event_hub_result.toString());
        }
      }


      return results;
      // var response = await channel.sendTransaction(transactionRequest);
      // logger.info("response", response);
      // logger.info("tx_id", tx_id);
      // return response;


    } else {
      return false;

    }
  }

  async getChannels(peer, username, org_name) {
    try {
      // first setup the client for this org
      const { client, options, channel, targets } = await this.getClient();
      logger.info('Successfully got the fabric client for the organization "%s"', org_name);

      let response = await client.queryChannels(peer);
      logger.info('response', response);
      if (response) {
        logger.info('<<< channels >>>');
        var channelNames = [];
        for (let i = 0; i < response.channels.length; i++) {
          channelNames.push('channel id: ' + response.channels[i].channel_id);
        }
        logger.info(channelNames);
        return response;
      } else {
        logger.info('response_payloads is null');
        return 'response_payloads is null';
      }
    } catch (error) {
      logger.info('Failed to query due to error: ' + error.stack ? error.stack : error);
      return error.toString();
    }
  };
}
module.exports = HfcService;
