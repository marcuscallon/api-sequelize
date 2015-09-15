'use strict';

/**
 * @method upsert
 * @return {Void}
 */
module.exports = function *upsert() {
  yield this._schema.upsert(this._data());
};