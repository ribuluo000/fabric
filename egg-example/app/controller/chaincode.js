'use strict';

const Controller = require('egg').Controller;
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('CHANNEL');
const path = require('path');
const dirPath = path.join(__dirname, '../fabric/first-network/');
const filePathInstallChaincode = path.join(__dirname, '../fabric/first-network/scripts/install-chaincode-pre.sh');
// const filePathInstallChaincode = path.join(__dirname, '../fabric/first-network/scripts/install-chaincode-pre.sh');
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

}

module.exports = ChaincodeController;
