'use strict';

let mysql     = require('mysql');
let sequelize = Bento.provider('sequelize');
let Group     = Bento.model('Group');
let GroupRole = Bento.model('GroupRole');
let log       = Bento.Log;
let error     = Bento.Error;
let config    = Bento.config.sequelize;

module.exports = function *() {
  yield verifyConfig();
  yield database();
  yield groups();
  yield require('./setup');
};

/**
 * Makes sure required database settings are present.
 * @return {Void}
 */
function *verifyConfig() {
  let errors = [];
  if (!config) {
    throw error.parse({
      code     : 'SEQUELIZE_CONFIG',
      message  : 'Missing sequelize configuration.',
      solution : 'Make sure the ./config/sequelize folder has a default and environment file set.'
    });
  }
  if (!config.host)     { errors.push('host'); }
  if (!config.database) { errors.push('database'); }
  if (!config.username) { errors.push('username'); }
  if (errors.length) {
    throw error.parse({
      code    : 'SEQUELIZE_CONFIG',
      message : `Missing required configuration settings [ ${ errors.join(', ') } ]`
    });
  }
}

/**
 * Sets up the database.
 * @return {Void}
 */
function *database() {
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

}

/**
 * Creates default group if it hasn't been defined.
 * @return {Void}
 */
function *groups() {
  let roles = Bento.Roles;
  let count = yield Group.count({ where : { name : 'General' } });
  if (!count) {
    let group = new Group({
      name : 'General'
    });
    yield group.save();
    for (let i = 0, len = roles.length; i < len; i++) {
      let groupRole = new GroupRole({
        groupId : group.id,
        title   : roles[i].title,
        role    : roles[i].name
      });
      yield groupRole.save();
    }
  }
}
