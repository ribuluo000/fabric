'use strict';

const Controller = require('egg').Controller;
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('CHANNEL');
const path = require('path');
const dirPath = path.join(__dirname, '../fabric/first-network/');
const filePathCreateChannel = path.join(__dirname, '../fabric/first-network/scripts/create-channel-pre.sh');
const filePathJoinChannel = path.join(__dirname, '../fabric/first-network/scripts/join-channel-pre.sh');
const { exec, execFileSync, execFile } = require('child_process');

class ChannelController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, channel';
  }
  async create() {
    const { ctx } = this;
    var channelName = 'mychannel391';
    logger.info('hi, create');
    try {
      const stdout = execFileSync(filePathCreateChannel, [channelName], { cwd: dirPath });
      logger.info(filePathCreateChannel + ' create result stdout:\n', stdout);
    } catch (error) {
      logger.error('error create result stdout:\n', error);
      logger.error('error create result stdout:\n', error.output.toString());

    }

    ctx.body = 'hi, create';
  }

  async join() {
    const { ctx } = this;
    var channelName = 'mychannel391';
    logger.info('hi, join');
    try {
      const stdout = execFileSync(filePathJoinChannel, [channelName], { cwd: dirPath });
      logger.info(filePathJoinChannel + ' join result stdout:\n', stdout);
    } catch (error) {
      logger.error('error join result stdout:\n', error);
      logger.error('error join result stdout:\n', error.output.toString());

    }

    ctx.body = 'hi, join';
  }

}

module.exports = ChannelController;
