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
  async init() {
    const { ctx } = this;
    logger.info('hi, init');
    // 输出当前目录（不一定是代码所在的目录）下的文件和文件夹
    exec('ls -l', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    })
    ctx.body = 'hi, init';
  }

  async init_generate() {
    const { ctx } = this;
    logger.info('hi, init_generate');
    const stdout = execFileSync(filePath, ['generate'], { cwd: dirPath });
    logger.info(filePath+ ' generate result stdout:\n',stdout);

    ctx.body = 'hi, init_generate';
  }


  async init_network_stop() {
    const { ctx } = this;
    logger.info('hi, init_network_stop');
    const stdout = execFileSync(filePath, ['down'], { cwd: dirPath });
    logger.info(filePath+ ' up result stdout:\n',stdout);

    ctx.body = 'hi, init_network_stop';
  }

  async init_network_start() {
    const { ctx } = this;
    logger.info('hi, init_network_start');
    const stdout = execFileSync(filePath, ['up'], { cwd: dirPath });
    logger.info(filePath+ ' up result stdout:\n',stdout);

    ctx.body = 'hi, init_network_start';
  }


  async init_network_start_a_couchdb() {
    const { ctx } = this;
    logger.info('hi, init_network_start_a_couchdb');
    const stdout = execFileSync(filePath, ['up', '-a', '-n', '-s', 'couchdb'], { cwd: dirPath });
    logger.info(filePath+ ' up result stdout:\n',stdout);

    ctx.body = 'hi, init_network_start_a_couchdb';
  }


}

module.exports = InitController;
