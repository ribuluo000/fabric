'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/init/generate', controller.init.generate);//生成加密证书以及网络基本配置文件
  router.get('/network/clear', controller.network.clear);//清除网络 慎用 会完全重置网络
  router.get('/network/stop', controller.network.stop);//停止网络
  router.get('/network/start', controller.network.start);//启动网络
  router.get('/network/start_a_couchdb', controller.network.start_a_couchdb);//启动网络带CA couchdb


  router.get('/channel/create', controller.channel.create);//创建 channel
  router.get('/channel/join', controller.channel.join);//加入 channel
  router.get('/channel/update', controller.channel.update);//updateAnchorPeers channel
  
  
  router.get('/chaincode/install', controller.chaincode.install);//install chaincode
  router.get('/chaincode/instantiate', controller.chaincode.instantiate);//instantiate chaincode
  router.get('/chaincode/upgrade', controller.chaincode.upgrade);//upgrade chaincode
  router.get('/chaincode/query', controller.chaincode.query);//query chaincode
  router.get('/chaincode/invoke', controller.chaincode.invoke);//invoke chaincode



};
