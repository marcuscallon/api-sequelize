'use strict';

let Sequelize  = require('sequelize');
let sequelize  = Reach.provider('sequelize');
let changeCase = Reach.Helpers.Case;
let type       = Reach.Helpers.Type;

module.exports = function (name, getModelSetup) {

  let _model = getModelSetup({}, Sequelize);

  /**
   * @class SequelizeModel
   * @constructor
   * @param {Object} data
   */
  function SequelizeModel(data) {
    let attrs = this.getAttributes();
    data = changeCase.objectKeys('toCamel', data);
    for (let key in data) {
      if (attrs.indexOf(key) !== -1) {
        this[key] = data[key];
      }
    }
  }

  // ### Snake Case
  // Set field value to snake_case of the provided schema keys.
  // !Apparently underscored is not working as expected

  for (let key in _model.schema) {
    _model.schema[key].field = changeCase.toSnake(key);
  }

  /**
   * Defines the schema with the sequelize instance.
   * @property _schema
   * @type     Object
   */
  SequelizeModel.prototype._schema = SequelizeModel._schema = sequelize.define(name, changeCase.objectKeys('toCamel', _model.schema), {
    tableName : _model.table,
    paranoid  : _model.paranoid !== undefined ? _model.paranoid : true
  });

  /**
   * The relation definitions of your model.
   * @property _relations
   * @type     Array
   */
  SequelizeModel._relations = _model.relations;

  /**
   * Attributes that can be provided that is not part of the model schema.
   * @property _attributes
   * @type     Array
   */
  SequelizeModel.prototype._attributes = SequelizeModel._attributes = [];

  /**
   * Attributes to remove before returning the model as JSON.
   * @property _blacklist
   * @type     Array
   */
  SequelizeModel.prototype._blacklist = _model.blacklist;

  // ### Static Methods

  SequelizeModel.count    = require('./count');
  SequelizeModel.find     = require('./find');
  SequelizeModel.findOne  = require('./findOne');
  SequelizeModel.findById = require('./findById');

  // ### Instance Methods

  SequelizeModel.prototype.save   = require('./save');
  SequelizeModel.prototype.upsert = require('./upsert');
  SequelizeModel.prototype.update = require('./update');
  SequelizeModel.prototype.delete = require('./delete');

  // ### Custom Methods

  if (_model.methods) {
    for (let key in _model.methods) {
      SequelizeModel.prototype[key] = _model.methods[key];
    }
  }

  /**
   * @method toJSON
   * @param  {Array} [attributes]
   * @return {Object}
   */
  SequelizeModel.prototype.toJSON = function (attributes) {
    let attrs = this.getAttributes();
    let data  = {};

    for (let i = 0, len = attrs.length; i < len; i++) {
      let key = attrs[i];
      if (this.hasOwnProperty(key)) {
        data[key] = this[key];
      }
    }

    if (this._blacklist && this._blacklist.length) {
      for (let i = 0, len = this._blacklist.length; i < len; i++) {
        let key = this._blacklist[i];
        if (data.hasOwnProperty(key)) {
          delete data[key];
        }
      }
    }

    if (type.isArray(attributes)) {
      for (let key in data) {
        if (attributes.indexOf(key) === -1) {
          delete data[key];
        }
      }
    }

    return data;
  };

  /**
   * Returns a list of defined data values on the instanced model.
   * @method _data
   * @return {Object}
   */
  SequelizeModel.prototype._data = function () {
    let attributes = this._schema.attributes;
    let result     = {};
    for (let key in attributes) {
      if (!this.hasOwnProperty(key)) {
        continue;
      }
      result[key] = this[key];
    }
    return result;
  };

  /**
   * Compiles a list of attributes currently available in the model.
   * @method getAttributes
   * @return {Array}
   */
  SequelizeModel.prototype.getAttributes = function() {
    let attrs = Object.keys(this._schema.attributes);
    if (this._attributes) {
      attrs = attrs.concat(this._attributes);
    }
    return changeCase.array('toCamel', attrs); 
  };

  return SequelizeModel;

};