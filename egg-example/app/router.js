'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/start_network/start', controller.network.start);
  router.get('/init/init', controller.init.init);
  router.get('/init/init_generate', controller.init.init_generate);//生成加密证书以及网络基本配置文件

};
