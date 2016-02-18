'use strict';

/**
 * Returns a model based on the provided id.
 * @param  {Mixed}  id
 * @param  {Object} [options]
 * @return {Object}
 */
module.exports = function *(id, options) {
  let result = yield this._schema.findById(id, options);
  if (!result) {
    return null;
  }
  return new this(result.dataValues);
};
