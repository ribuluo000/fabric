'use strict';

const Controller = require('egg').Controller;
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('CHANNEL');
const path = require('path');
const dirPath = path.join(__dirname, '../fabric/first-network/');
const filePathInstallChaincode = path.join(__dirname, '../fabric/first-network/scripts/install-chaincode-pre.sh');
const filePathInstantiateChaincode = path.join(__dirname, '../fabric/first-network/scripts/instantiate-chaincode-pre.sh');
const filePathUpgradeChaincode = path.join(__dirname, '../fabric/first-network/scripts/upgrade-chaincode-pre.sh');
const { exec, execFileSync, execFile } = require('child_process');

const COLLECTIONS_CONFIG_PATH = path.resolve(__dirname, '../fabric/chaincode/chaincode_example02/node/collections_config.json');

function buildChaincodeUpgradeProposal(client, theuser, chaincode_id, chaincode_path, version, type, upgrade, transientMap) {
	const tx_id = client.newTransactionID();

	// send proposal to endorser
	const request = {
		chaincodePath: chaincode_path,
		chaincodeId: chaincode_id,
		chaincodeVersion: version,
		fcn: 'init',
		args: ['a', '100', 'b', '200'],
		txId: tx_id,
		chaincodeType: type,
		// use this to demonstrate the following policy:
		// 'if signed by org1 admin, then that's the only signature required,
		// but if that signature is missing, then the policy can also be fulfilled
		// when members (non-admin) from both orgs signed'
		'endorsement-policy': {
			identities: [
				{role: {name: 'member', mspId: 'Org1MSP'}},
				{role: {name: 'member', mspId: 'Org2MSP'}},
				{role: {name: 'admin', mspId: 'Org1MSP'}}
			],
			policy: {
				'1-of': [
					{'signed-by': 2},
					{'2-of': [{'signed-by': 0}, {'signed-by': 1}]}
				]
			}
		},
		'collections-config': COLLECTIONS_CONFIG_PATH
	};

	if (version === 'v3') {
		request.args = ['b', '1000'];
	}

	if (upgrade) {
		// use this call to test the transient map support during chaincode instantiation
		request.transientMap = transientMap;
	}

	return request;
}

class ChaincodeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, chaincode';
  }
  async install() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, install');
    try {
      const stdout = execFileSync(filePathInstallChaincode, [channelName], { cwd: dirPath });
      logger.info(filePathInstallChaincode + ' install result stdout:\n', stdout);
      logger.info(filePathInstallChaincode + ' install result stdout:\n', stdout.toString());
    } catch (error) {
      logger.error('error install result stdout:\n', error);
      logger.error('error install result stdout:\n', error.output.toString());

    }

    ctx.body = 'hi, install';
  }

  async instantiate() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, instantiate');
    try {
      const stdout = execFileSync(filePathInstantiateChaincode, [channelName], { cwd: dirPath });
      logger.info(filePathInstantiateChaincode + ' instantiate result stdout:\n', stdout);
      logger.info(filePathInstantiateChaincode + ' instantiate result stdout:\n', stdout.toString());
    } catch (error) {
      logger.error('error instantiate result stdout:\n', error);
      logger.error('error instantiate result stdout:\n', error.output.toString());

    }

    ctx.body = 'hi, instantiate';
  }


  async upgrade() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, upgrade');
    try {
      const stdout = execFileSync(filePathUpgradeChaincode, [channelName], { cwd: dirPath });
      logger.info(filePathUpgradeChaincode + ' upgrade result stdout:\n', stdout);
      logger.info(filePathUpgradeChaincode + ' upgrade result stdout:\n', stdout.toString());
    } catch (error) {
      logger.error('error upgrade result stdout:\n', error);
      logger.error('error upgrade result stdout:\n', error.output.toString());

    }

    ctx.body = 'hi, upgrade';
  }

  async update2() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, update');
    let data = '';
    try {
      const { client, options, channel } = await ctx.service.hfc.getClient();

      const tx_id = client.newTransactionID();
      logger.info("tx_id", tx_id);
      logger.info("tx_id._transaction_id", tx_id._transaction_id);

      //查询余额
      var request = null;
      const transientMap = {'test': Buffer.from('transientValue')};

      request = buildChaincodeUpgradeProposal(client,'admin',options.chaincode_id,options.chaincode_path,options.chaincode_version,'node',true,transientMap);
      logger.info("request", request);


      const results = await channel.sendUpgradeProposal(request, 100000);
      const response = await ctx.service.hfc.getSendTransactionProposalResponse(results);
      data = response.payload;

      // logger.info('client:\n', client);
    } catch (error) {
      logger.error('error update result stdout:\n', error);

    }

    ctx.body = 'hi, update ' + data;
  }

  async query() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, query');
    let data = '';

    try {
      const request = {
        fcn: 'query',
        args: ['a'],
      };
      data = await ctx.service.hfc.query(request);

      // logger.info('client:\n', client);
    } catch (error) {
      logger.error('error query result stdout:\n', error);

    }

    ctx.body = 'hi, query ' + data;
  }

  async invoke() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, invoke');
    let data = '';
    try {
      //发起转账行为，将a->b 10元 
      var request = {
        // "targets": ["peer0.org1.example.com"],
        fcn: 'invoke',
        args: ['a', 'b', '10'],
      };
      const response = await ctx.service.hfc.sendTransaction(request);
      data = response;

      // logger.info('client:\n', client);
    } catch (error) {
      logger.error('error invoke result stdout:\n', error);

    }

    ctx.body = 'hi, invoke ' + data;
  }


}

module.exports = ChaincodeController;
