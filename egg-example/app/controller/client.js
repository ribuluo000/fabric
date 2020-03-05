'use strict';

const Controller = require('egg').Controller;
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('CHANNEL');

class ClientController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, client';
  }
  
  async getChannels() {
    const { ctx } = this;
    var channelName = 'mychannel396';
    logger.info('hi, getChannels');
    let data = '';
    try {
      const response = await ctx.service.hfc.getChannels('peer0.org1.example.com');
      data = response;

      // logger.info('client:\n', client);
    } catch (error) {
      logger.error('error getChannels result stdout:\n', error);

    }

    ctx.body = 'hi, getChannels ' + data;
  }


}

module.exports = ClientController;
