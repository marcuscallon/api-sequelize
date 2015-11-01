'use strict';

let changeCase = Bento.Helpers.Case;

/**
 * Stores a new record in the database with the populated model data.
 * @method save
 * @return {Void}
 */
module.exports = function *save() {
  let result = yield this._schema.create(this._data());
  let values = changeCase.objectKeys('toCamel', result.dataValues);
  for (let key in values) {
    this[key] = values[key];
  }
};