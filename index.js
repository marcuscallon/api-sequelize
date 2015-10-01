'use strict';

let Sequelize = require('sequelize');
let error     = Reach.Error;
let log       = Reach.Log;
let config    = Reach.config.sequelize;

if (!config) {
  throw error.parse({
    code     : 'SEQUELIZE_MISSING_CONFIG',
    message  : 'Sequelize service is missing configuration',
    solution : 'Make sure you have created a configuration file for sequelize in the config folder'
  });
}

let sequelize = new Sequelize(config.database, config.username, config.password, {
  host    : config.host,
  dialect : config.dialect,
  pool    : {
    maxConnections : config.pool.max,
    minConnections : config.pool.min,
    maxIdleTime    : config.pool.idle
  },
  define : {
    underscored : true
  },
  logging : function (str) {
    if (config.debug) {
      log.debug(str);
    }
  }
});

// ### Dirty Connection Fix

process.on('uncaughtException', function (error) {
  if (error.code !== 'PROTOCOL_CONNECTION_LOST') {
    throw error;
  }
});

module.exports = sequelize;