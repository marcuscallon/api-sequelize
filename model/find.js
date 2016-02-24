'use strict';

let queryParser   = require('../lib/query-parser');
let parseRelation = require('../lib/relations');
let relay         = Bento.Relay;
let types         = Bento.Type;
let log           = Bento.Log;

/**
 * Finds a list of records based on the provided query options.
 * @param  {Object}  query     The query|options object to use on the sequelize method.
 * @param  {Boolean} runFilter Run the registered filter on the incoming query.
 * @return {Array}
 */
module.exports = function *find(query, runFilter) {
  let options = {};

  // ### Filter
  // If the model has a filter defined we run the provided query through the filter.

  if (runFilter && this._filter) {
    options = this._filter(queryParser, query);
  } else {
    options = query;
  }

  // ### Find
  // Runs a sequelize .findAll request on the model _schema.

  let result = yield this._schema.findAll(options);
  if (!result) {
    return null;
  }
  result = result.map(res => new this(res.dataValues));

  // ### Append Relay
  // Add relay features to the resulting array for easier relay transmissions.

  result.relay   = sequelizeRelay.bind(this, result);
  result.with    = relations.bind(this, result);
  result.hasOne  = shortRelations.bind(result, 'hasOne');
  result.hasMany = shortRelations.bind(result, 'hasMany');

  return result;
};

function *shortRelations(type, relations) {
  if (Array.isArray(relations)) {
    let list = [];
    for (let i = 0, len = relations.length; i < len; i++) {
      list.push(parseRelation(type, relations[i], true));
    }
    yield this.with(list);
  } else {
    yield this.with([ parseRelation(type, relations, true) ]);
  }
}

/**
 * Performs a relations on a array of models.
 * @param {Array} data
 * @param {Array} relations
 */
function *relations(data, relations) {
  for (let i = 0, len = relations.length; i < len; i++) {
    let options = relations[i];
    let Model   = Bento.model(options.model);
    let query   = Object.assign({}, options.where);

    // ### Query
    // Create the relation query.

    for (let key in query) {
      query[key] = {
        $in : data.reduce((list, next) => {
          if (list.indexOf(next[query[key]]) === -1) {
            list.push(next[query[key]]);
          }
          return list;
        }, [])
      }
    }

    // ### Find
    // Perform a find operation on the requested relations.

    let list = yield Model.find({
      where : query
    });

    // ### Data Mapping
    // Perform an array map where we assign the group based on the related
    // search results.

    data.map(model => {
      let res = null;
      switch (options.relation) {
        case 'hasOne' : {
          res = relationHasOne(list, model, options.where);
          break;
        }
        case 'hasMany' : {
          res = relationHasMany(list, model, options.where);
          break;
        }
      }
      model[options.as] = res;
      model._attributes.push(options.as);
    });
  }
}

/**
 * Returns the one to one relation from a list to the model.
 * @param  {Array}  list
 * @param  {Object} model
 * @param  {Object} query
 * @return {Object}
 */
function relationHasOne(list, model, query) {
  return list.find(res => {
    for (let key in query) {
      if (res[key] !== model[query[key]]) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Returns a one to many relation from a list to the model.
 * @param  {Array}  list
 * @param  {Object} model
 * @param  {Object} query
 * @return {Array}
 */
function relationHasMany(list, model, query) {
  return list.reduce((list, next) => {
    for (let key in query) {
      if (next[key] !== model[query[key]]) {
        return list;
      }
    }
    list.push(next);
    return list;
  }, []);
}

/**
 * Sends a data array of object over the relay.
 * @param  {Array}  data       This is bound internally and is not used when executing the method.
 * @param  {String} type       The relay type create|update|delete
 * @param  {String} [resource] Optionaly set if you have a custom resource or uses models resource value.
 * @param  {Object} [user]     Set when you wish to transmit only to a specific user.
 */
function sequelizeRelay(data, type, resource, user) {
  let payload = {
    type : type,
    data : data
  };

  // ### Optional Arguments

  if (types.isObject(resource)) {
    user     = resource;
    resource = this._resource;
  } else {
    resource = resource || this._resource;
  }

  // ### Emit
  // If a user is provided the relay emission is treated as a private
  // transmission and is only served to the user provided and admins.

  if (user) {
    relay.user(user.id, resource, payload);
    relay.admin(resource, payload);
  } else {
    relay.emit(resource, payload);
  }

  if (!Bento.isTesting()) {
    log.debug(`Relay [${ resource }:${ type }][...${ resource }]`);
  }
}
