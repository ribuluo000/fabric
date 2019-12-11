'use strict';

const Controller = require('egg').Controller;
const Client = require('fabric-client');
const utils = require('fabric-client/lib/utils.js');
const logger = utils.getLogger('INIT');
const path = require('path');
const dirPath = path.join(__dirname, '../fabric/first-network/');
const filePath = path.join(__dirname, '../fabric/first-network/byfn.sh');
const { exec, execFileSync, execFile } = require('child_process');

class InitController extends Controller {
  async index() {
    const { ctx } = this;
    logger.info('hi, init');
    ctx.body = 'hi, init';
  }

  async generate() {
    const { ctx } = this;
    logger.info('hi, generate');
    const stdout = execFileSync(filePath, ['generate'], { cwd: dirPath });
    logger.info(filePath + ' generate result stdout:\n', stdout);

    ctx.body = 'hi, generate';
  }
}

module.exports = InitController;
