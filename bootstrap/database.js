'use strict';

let mysql  = require('mysql');
let config = Reach.config.sequelize;

module.exports = function *() {
  let host = mysql.createConnection({
    host     : config.host,
    user     : config.username,
    password : config.password
  });

  yield new Promise(function (resolve, reject) {
    host.connect(function (err) {
      if (err) { return reject(err); }
      resolve();
    });
  });

  if (config.force) {
    yield new Promise(function (resolve, reject) {
      host.query('DROP DATABASE IF EXISTS ' + config.database, function (err) {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  yield new Promise(function (resolve, reject) {
    host.query('CREATE DATABASE IF NOT EXISTS ' + config.database + ' CHARACTER SET = utf8 COLLATE = ' + (config.charset || 'utf8_unicode_ci'), function (err) {
      if (err) { return reject(err); }
      resolve();
    });
  });
};