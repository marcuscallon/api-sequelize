'use strict';

let Relations = require('../helpers').Relations;

/**
 * Finds a list of records based on the provided query options.
 * @method find
 * @param  {Object} options
 * @return {Array}
 */
module.exports = function *find(options) {
  let relations = new Relations(this, options);
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