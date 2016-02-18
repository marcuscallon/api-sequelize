'use strict';

let queryParser = require('../lib/query-parser');
let relay       = Bento.Relay;
let types       = Bento.Type;
let log         = Bento.Log;

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

  result.relay = sequelizeRelay.bind(this, result);

  return result;
};

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
