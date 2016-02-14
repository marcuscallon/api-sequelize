'use strict';

let relay      = Bento.Relay;
let log        = Bento.Log;
let changeCase = Bento.Helpers.Case;
let types      = Bento.Helpers.Type;

/**
 * Relays the instanced data over the connected web sockets.
 * @param  {String} type       The transmission type create|update|delete.
 * @param  {String} [resource] The resource identifier of the relay.
 * @param  {Object} [options]  The relay options.
 * @return {Void}
 */
module.exports = function SequelizeRelay(type, resource, options) {
  let payload = {
    type : type,
    data : this.toJSON()
  };
  if (types.isObject(resource)) {
    options  = resource;
    resource = this._resource;
  } else {
    resource = resource || this._resource;
    if (!options) {
      options = {};
    }
  }
  switch (options.to) {
    case 'user' : {
      relay.user(options.userId, resource, payload);
      if (options.groupId) {
        relay.admin(options.groupId, resource, payload);
      }
      break;
    }
    case 'group' : {
      relay.group(options.groupId, resource, payload);
      break;
    }
    case 'admin' : {
      relay.admin(options.groupId, resource, payload);
      break;
    }
    case 'super' : {
      relay.super(resource, payload);
      break;
    }
    default : {
      relay.emit(resource, payload);
    }
  }
};
