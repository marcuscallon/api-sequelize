'use strict';

let util = require('util');

/**
 * @class Relations
 * @param {Object} SequelizeModel
 * @param {Object} options
 */
let Relations = module.exports = function Relations(SequelizeModel, options) {
  if (!options || !options.include) {
    return; 
  }
  if (options.include) {
    this.exists = true;
    for (let i = 0, len = options.include.length; i < len; i++) {
      let relation = options.include[i];
      let model    = Reach.model(relation.model);

      this.store[relation]       = {};
      this.store[relation].as    = relation.as;
      this.store[relation].model = model;
      this.store[relation].attr  = relation.attr || null;

      options.include[i].model = model._schema;
      SequelizeModel._attributes.push(relation.as);
    }
  }
};

/**
 * @property exists
 * @type     Boolean
 * @default  false
 */
Relations.prototype.exists = false;

/**
 * @property store
 * @type     Object
 * @default  {}
 */
Relations.prototype.store = {};

/**
 * @method prepare
 * @param  {Object} data
 */
Relations.prototype.prepare = function (data) {
  let relations = this.store;
  for (let key in relations) {
    data[key] = populateRelation(data[relations[key].as], relations[key]);
  }
};

/**
 * @private
 * @method populateRelation
 * @param  {Mixed}    data
 * @param  {Function} relation
 * @return {Mixed}
 */
function populateRelation(data, relation) {
  if (!data) { return null; }
  let Model = relation.model;
  if (util.isArray(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = new Model(data[i].dataValues).toJSON(relation.attr);
    }
    return data;
  }
  return new Model(data.dataValues).toJSON(relation.attr);
}