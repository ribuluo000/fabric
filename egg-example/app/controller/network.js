'use strict';

const Controller = require('egg').Controller;
const Client = require('fabric-client');
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('NETWORK');
const path = require('path');
const dirPath = path.join(__dirname, '../fabric/first-network/');
const filePath = path.join(__dirname, '../fabric/first-network/byfn.sh');
const { exec, execFileSync, execFile } = require('child_process');

class NetworkController extends Controller {
  async index() {
    const { ctx } = this;
    logger.info('hi, network');
    ctx.body = 'hi, network';
  }


  async clear() {
    const { ctx } = this;
    logger.info('hi, clear');
    const stdout = execFileSync(filePath, ['clear'], { cwd: dirPath });
    logger.info(filePath + ' clear result stdout:\n', stdout);

    ctx.body = 'hi, clear';
  }

  async stop() {
    const { ctx } = this;
    logger.info('hi, stop');
    const stdout = execFileSync(filePath, ['down'], { cwd: dirPath });
    logger.info(filePath + ' down result stdout:\n', stdout);

    ctx.body = 'hi, stop';
  }

  async start() {
    const { ctx } = this;
    logger.info('hi, start');
    const stdout = execFileSync(filePath, ['up'], { cwd: dirPath });
    logger.info(filePath + ' up result stdout:\n', stdout);

    ctx.body = 'hi, start';
  }

  async start_a_couchdb() {
    const { ctx } = this;
    logger.info('hi, start_a_couchdb');
    const stdout = execFileSync(filePath, ['up', '-a', '-n', '-s', 'couchdb'], { cwd: dirPath });
    logger.info(filePath + ' up result stdout:\n', stdout);

    ctx.body = 'hi, start_a_couchdb';
  }


}

module.exports = NetworkController;
