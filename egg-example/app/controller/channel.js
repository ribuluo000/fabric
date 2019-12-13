'use strict';

const Controller = require('egg').Controller;
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('CHANNEL');
const path = require('path');
const dirPath = path.join(__dirname, '../fabric/first-network/scripts/');
const filePath = path.join(__dirname, '../fabric/first-network/scripts/create-channel-pre.sh');
const { exec, execFileSync, execFile } = require('child_process');

class ChannelController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, channel';
  }
  async create() {
    const { ctx } = this;
    var channelName = 'mychannel38';
    logger.info('hi, create');
    try {
      const stdout = execFileSync(filePath, [channelName], { cwd: dirPath });
      logger.info(filePath + ' create result stdout:\n', stdout);
    } catch (error) {
      logger.error('error create result stdout:\n', error);
      logger.error('error create result stdout:\n', error.output.toString());

    }

    ctx.body = 'hi, create';
  }

}

module.exports = ChannelController;
