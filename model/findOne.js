'use strict';

let queryParser = require('../lib/query-parser');

/**
 * Retrieves a single record based on the query provided.
 * @param  {Object}  query     The query|options object to use on the sequelize method.
 * @param  {Boolean} runFilter Run the registered filter on the incoming query.
 * @return {Model}
 */
module.exports = function *(query, runFilter) {
  let options = {};

  // ### Filter
  // If the model has a filter defined we run the provided query through the filter.

  if (runFilter && this._filter) {
    options = this._filter(queryParser, query);
  } else {
    options = query;
  }

  // ### Find
  // Runs a sequelize .findOne request on the model _schema.

  let result = yield this._schema.findOne(options);
  if (!result) {
    return null;
  }
  return new this(result.dataValues);
};
