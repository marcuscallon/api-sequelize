'use strict';

let mysql     = require('mysql');
let sequelize = Bento.provider('sequelize');
let config    = Bento.config.sequelize;
let log       = Bento.Log;

module.exports = function *() {
  let host = mysql.createConnection({
    host     : config.host,
    user     : config.username,
    password : config.password
  });

  // ### Connection Test
  // Test to see if the connection is valid.

  yield new Promise((resolve, reject) => {
    host.connect((err) => {
      if (err) {
        return reject(err);
      }
      log.info(' - Connection Success!');
      resolve();
    });
  });

  // ### Drop Database
  // Drop database if force is set to true.

  if (config.force) {
    yield new Promise((resolve, reject) => {
      host.query('DROP DATABASE IF EXISTS ' + config.database, (err) => {
        if (err) {
          return reject(err);
        }
        log.info(` - Dropped Database [${ config.database }]`);
        resolve();
      });
    });
  }

  // ### Create Database

  yield new Promise((resolve, reject) => {
    host.query('CREATE DATABASE IF NOT EXISTS ' + config.database + ' CHARACTER SET = utf8 COLLATE = ' + (config.charset || 'utf8_unicode_ci'), (err) => {
      if (err) {
        return reject(err);
      }
      log.info(` - Created Database [${ config.database }]`);
      resolve();
    });
  });

  // ### Sync Models

  yield sequelize.sync({
    force : config.force
  });

  // ### Setup Relations

  yield require('./setup');
};
