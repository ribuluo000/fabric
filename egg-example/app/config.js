var util = require('util');
var path = require('path');
var hfc = require('fabric-client');

var file = 'docker-compose-e2e%s.yaml';

var env = process.env.TARGET_NETWORK;
if (env)
	file = util.format(file, '-' + env);
else
	file = util.format(file, '');
// indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
hfc.setConfigSetting('network-connection-profile-path',path.join(__dirname, 'fabric' , 'first-network', file));
hfc.setConfigSetting('Org1-connection-profile-path',path.join(__dirname, 'fabric' , 'first-network', 'connection-org1.yaml'));
hfc.setConfigSetting('Org2-connection-profile-path',path.join(__dirname, 'fabric' , 'first-network', 'connection-org2.yaml'));
// some other settings the application might need to know
hfc.addConfigFile(path.join(__dirname, 'config.json'));
