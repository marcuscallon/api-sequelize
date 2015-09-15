'use strict';

/**
 * Provides a record count based on the provided query options.
 * @method count
 * @param  {Object} options
 * @return {Int}
 */
module.exports = function *count(options) {
  return yield this._schema.count(options);
};