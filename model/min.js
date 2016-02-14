'use strict';

/**
 * Provides the min value of the provided field.
 * @param  {String} field
 * @param  {Object} options
 * @return {Integer}
 */
module.exports = function *min(field, options) {
  try {
    return yield this._schema.min(field, options);
  } catch (err) {
    throw this._error('MIN', err);
  }
};
