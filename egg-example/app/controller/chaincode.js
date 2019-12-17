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

class ChaincodeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, chaincode';
  }
  async install() {
    const { ctx } = this;
    var channelName = 'mychannel395';
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
    var channelName = 'mychannel395';
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
    var channelName = 'mychannel395';
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

  async query() {
    const { ctx } = this;
    var channelName = 'mychannel395';
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
    var channelName = 'mychannel395';
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
