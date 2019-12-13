'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/init/generate', controller.init.generate);//生成加密证书以及网络基本配置文件
  router.get('/network/stop', controller.network.stop);//停止网络
  router.get('/network/start', controller.network.start);//启动网络
  router.get('/network/start_a_couchdb', controller.network.start_a_couchdb);//启动网络带CA couchdb


  router.get('/channel/create', controller.channel.create);//创建 channel



};
