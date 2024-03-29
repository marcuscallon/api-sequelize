'use strict';

let changeCase = Bento.ChangeCase;

/**
 * Stores a new record in the database with the populated model data.
 * @return {Object}
 */
module.exports = function *save() {
  let result = null;
  try {
    result = yield this._schema.create(this._data());
  } catch (err) {
    throw this._error('SAVE', err);
  }
  let values = changeCase.objectKeys('toCamel', result.dataValues);
  for (let key in values) {
    this[key] = values[key];
  }
  return this;
};
