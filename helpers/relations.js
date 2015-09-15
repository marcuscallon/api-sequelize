'use strict';

let type = Reach.Helpers.Type;

/**
 * @class Relations
 * @param {Object} Model
 * @param {Object} options
 */
let Relations = module.exports = function Relations(Model, options) {
  if (!options || !options.include) {
    return; 
  }
  if (options.include) {
    this.exists = true;
    for (let i = 0, len = options.include.length; i < len; i++) {
      let relation = options.include[i];
      let model    = Reach.model(relation.model);

      this.store[relation.as]       = {};
      this.store[relation.as].model = model;
      this.store[relation.as].attr  = relation.attr || null;

      options.include[i].model = model._schema;
      Model._attributes.push(relation.as);
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
    data[key] = populateRelation(data[key], relations[key]);
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
  let model = null;
  if (type.isArray(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      model = new Model(data[i].dataValues);
      model.toJSON.bind(model, relation.attr);
      data[i] = model;
    }
    return data;
  }
  model = new Model(data.dataValues);
  model.toJSON.bind(model, relation.attr);
  return model;
}