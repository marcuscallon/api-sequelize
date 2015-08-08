'use strict';

let Sequelize  = require('sequelize');
let util       = require('util');
let moment     = require('moment');
let sequelize  = Reach.service('sequelize');
let changeCase = Reach.Helpers.Case;

module.exports = function (name, getModelSetup) {

  let _model = getModelSetup({}, Sequelize);

  /**
   * @class SequelizeModel
   */
  function SequelizeModel(data) {
    let attrs = this.getAttributes();
    let self  = this;

    data = changeCase.objectKeys('toCamel', data);
    attrs.forEach(function (key) {
      self[key] = data.hasOwnProperty(key) ? data[key] : null;
    });
  }

  /**
   * @property _schema
   * @type     Object
   */
  SequelizeModel.prototype._schema = SequelizeModel._schema = sequelize.define(name, changeCase.objectKeys('toCamel', _model.schema), {
    tableName : _model.table,
    paranoid  : _model.paranoid ? _model.paranoid : true
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
  SequelizeModel.prototype._attributes = _model.attributes;

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
    let values = result.dataValues;
    for (let key in values) {
      let camelKey = changeCase.toCamel(key);
      if (this.hasOwnProperty(camelKey)) {
        this[camelKey] = values[key];
      }
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
    let relations = getRelations(options);
    let result    = yield this._schema.findAll(options);
    if (!result) {
      return null;
    }
    let Model = this;
    return result.reduce(function (store, value) {
      let data = value.dataValues;
      if (relations) {
        for (let key in relations) {
          data[key] = populateRelation(data[key], relations[key]);
        }
      }
      return store.concat(new Model(data));
    }, []);
  };

  /**
   * @method findOne
   * @param  {Object} options
   * @return {SequelizeModel}
   */
  SequelizeModel.findOne = function *(options) {
    let relations = getRelations(options);
    let result    = yield this._schema.findOne(options);
    if (!result) {
      return null;
    }
    let data = result.dataValues;
    if (relations) {
      for (let key in relations) {
        data[key] = populateRelation(data[key], relations[key]);
      }
    }
    return new this(data);
  };

  /**
   * @method findById
   * @param  {Mixed} id
   * @return {SequelizeModel}
   */
  SequelizeModel.findById = function *(id) {
    let result = yield this._schema.findById(id);
    if (!result) {
      return null;
    }
    return new this(result.dataValues);
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
   * @return {Void}
   */
  SequelizeModel.prototype.delete = function *() {
    yield this._schema.destroy({ where : { id : this.id } });
    this.deletedAt = moment().utc().format('YYYY-MM-DD\THH:mm:ss') + '.000Z';
  };

  /**
   * @method toJSON
   * @return {Object}
   */
  SequelizeModel.prototype.toJSON = function () {
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
      if (!this.hasOwnProperty(key) || !this[key]) {
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
    return changeCase.arrayKeys('toCamel', attrs); 
  };

  /**
   * @private
   * @method populateRelation
   * @param  {Mixed}    data
   * @param  {Function} Model
   * @return {Mixed}
   */
  function populateRelation(data, Model) {
    if (!data) { return null; }
    if (util.isArray(data)) {
      for (let i = 0, len = data.length; i < len; i++) {
        data[i] = new Model(data[i].dataValues);
      } 
    } else {
      data = new Model(data.dataValues);
    }
    return data;
  }

  /**
   * Extracts the relations from the options to create a key => value
   * relational match before correcting the include model.
   * @private
   * @method getRelations
   * @param  {Object} options
   * @return {Object}
   */
  function getRelations(options) {
    if (!options || !options.include) { 
      return; 
    }
    let relations = {};
    if (options.include) {
      options.include.forEach(function (rel, indx) {
        relations[rel.as] = rel.model;
        rel.model = rel.model._schema;
        options.include[indx] = rel;
      });
    }
    return relations;
  }

  return SequelizeModel;

};