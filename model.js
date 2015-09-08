'use strict';

let Sequelize  = require('sequelize');
let util       = require('util');
let moment     = require('moment');
let Relations  = require('./helpers').Relations;
let sequelize  = Reach.provider('sequelize');
let changeCase = Reach.Helpers.Case;

module.exports = function (name, getModelSetup) {

  let _model = getModelSetup({}, Sequelize);

  /**
   * @class SequelizeModel
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

  /**
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

  // ### Module Methods

  if (_model.methods) {
    for (let key in _model.methods) {
      SequelizeModel.prototype[key] = _model.methods[key];
    }
  }

  /**
   * @method save
   * @return {Void}
   */
  SequelizeModel.prototype.save = function *() {
    let result = yield this._schema.create(this._data());
    let values = changeCase.objectKeys('toCamel', result.dataValues);
    for (let key in values) {
      this[key] = values[key];
    }
  };

  /**
   * @method upsert
   * @return {Void}
   */
  SequelizeModel.prototype.upsert = function *() {
    yield this._schema.upsert(this._data());
  };

  /**
   * @method count
   * @param  {Object} options
   * @return {Int}
   */
  SequelizeModel.count = function *(options) {
    return yield this._schema.count(options);
  };

  /**
   * @method find
   * @param  {Object} options
   * @return {Array}
   */
  SequelizeModel.find = function *(options) {
    let relations = new Relations(SequelizeModel, options);
    let result    = yield this._schema.findAll(options);
    if (!result) {
      return null;
    }
    for (let i = 0, len = result.length; i < len; i++) {
      let data = result[i].dataValues;
      if (relations.exists) {
        relations.prepare(data);
      }
      result[i] = new this(data);
    }
    return result;
  };

  /**
   * @method findOne
   * @param  {Object} options
   * @return {SequelizeModel}
   */
  SequelizeModel.findOne = function *(options) {
    let relations = new Relations(SequelizeModel, options);
    let result    = yield this._schema.findOne(options);
    if (!result) {
      return null;
    }
    let data = result.dataValues;
    if (relations.exists) {
      relations.prepare(data);
    }
    return new this(data);
  };

  /**
   * @method findById
   * @param  {Mixed}  id
   * @param  {Object} [options]
   * @return {SequelizeModel}
   */
  SequelizeModel.findById = function *(id, options) {
    let relations = new Relations(SequelizeModel, options);
    let result    = yield this._schema.findById(id, options);
    if (!result) {
      return null;
    }
    let data = result.dataValues;
    if (relations.exists) {
      relations.prepare(data);
    }
    return new this(data);
  };

  /**
   * @method update
   * @param  {String} [pk] PrimaryKey for the model
   * @return {Void}
   */
  SequelizeModel.prototype.update = function *(pk) {
    let options = { where : {} }
    if (pk) {
      options.where[pk] = this[pk];
    } else {
      options.where.id = this.id;
    }
    yield this._schema.update(this._data(), options);
    this.updatedAt = moment().utc().format('YYYY-MM-DD\THH:mm:ss') + '.000Z';
  };

  /**
   * @method delete
   * @param  {String} [pk]
   * @return {Void}
   */
  SequelizeModel.prototype.delete = function *(pk) {
    let options = { where : {} }
    if (pk) {
      options.where[pk] = this[pk];
    } else {
      options.where.id = this.id;
    }
    yield this._schema.destroy(options);
    this.deletedAt = moment().utc().format('YYYY-MM-DD\THH:mm:ss') + '.000Z';
  };

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

    if (util.isArray(attributes)) {
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