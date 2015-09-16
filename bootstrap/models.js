'use strict';

let mysql      = require('mysql');
let fs         = require('co-fs');
let path       = require('path');
let glob       = require('co-glob');
let sequelize  = Reach.provider('sequelize');
let changeCase = Reach.Helpers.Case;
let config     = Reach.config.sequelize;

module.exports = function *() {
  yield loadInterfaceModels();
  yield loadModuleModels();
  yield sequelize.sync({
    force : config.force
  });
  yield require('../setup');
};

/**
 * @private
 * @method loadInterfaceModels
 */
function *loadInterfaceModels() {
  loadModelsList(Reach.INTERFACE_PATH, [ 'user.js', 'group.js', 'user-group.js' ]);
};

/**
 * Loads all models defined in database
 * @private
 * @method loadModels
 */
function *loadModuleModels() {
  let modules = yield fs.readdir(Reach.MODULE_PATH);
  for (let i = 0, len = modules.length; i < len; i++) {
    let module     = modules[i];
    let dir        = path.join(Reach.MODULE_PATH, module, 'models');
    let loaderFile = path.join(dir, '.loader');
    if (yield fs.exists(loaderFile)) {
      let list = JSON.parse(yield fs.readFile(loaderFile)).models;
      loadModelsList(dir, list);
      continue;
    }
    let list = yield glob('*.js', { cwd : dir });
    loadModelsList(dir, list);
  }
}

/**
 * @private
 * @method loadModelsList
 * @param  {String} dir
 * @param  {Array}  list
 */
function loadModelsList(dir, list) {
  for (let i = 0, len = list.length; i < len; i++) {
    require(path.join(dir, list[i]));
  }
}