'use strict';

/**
 * Provides the sum of the provided field.
 * @param  {String} field
 * @param  {Object} options
 * @return {Integer}
 */
module.exports = function *sum(field, options) {
  try {
    return yield this._schema.sum(field, options);
  } catch (err) {
    throw this._error('SUM', err);
  }
};
