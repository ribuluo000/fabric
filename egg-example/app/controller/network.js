'use strict';

const Controller = require('egg').Controller;
const Client = require('fabric-client');
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('NETWORK');

class NetworkController extends Controller {
  async start() {
    const { ctx } = this;
    logger.info('hi, network start');
    ctx.body = 'hi, network start';
  }

}

module.exports = NetworkController;
