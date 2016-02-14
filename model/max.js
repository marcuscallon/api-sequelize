'use strict';

/**
 * Provides the max value of the provided field.
 * @param  {String} field
 * @param  {Object} options
 * @return {Integer}
 */
module.exports = function *max(field, options) {
  try {
    return yield this._schema.max(field, options);
  } catch (err) {
    throw this._error('MAX', err);
  }
};
