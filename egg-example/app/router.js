'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/start_network/start', controller.network.start);
  router.get('/init/init', controller.init.init);

};
