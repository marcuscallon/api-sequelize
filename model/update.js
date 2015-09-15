'use strict';

let moment = require('moment');
let error  = Reach.Error;
let type   = Reach.Helpers.Type;

/**
 * Performs an update on the sequelize database with the provided data.
 * @method update
 * @param  {Object} data
 * @param  {String} [pk]
 * @return {Void}
 */
module.exports = function *update(data, pk) {
  pk = pk || 'id';

  // ### Query Options
  // Make sure we use the correct primary key of the model.

  let options = { 
    where : {} 
  };
  options.where[pk] = this[pk];

  // ### Validate Data
  // Make sure the data provided is a valid object.

  if (!type.isObject(data)) {
    throw error.parse({
      code     : `INVALID_UPDATE_DATA`,
      message  : `The provided update data was not a valid [Object].`,
      solution : `Make sure your update methods are providing a valid update object.`
    }, 500);
  }

  // ### Update Model

  let result = yield this._schema.update(data, options);

  // ### Temporary Timestamp
  // We add a temporary updatedAt timestamp since we are not receiving this
  // from the resulting update operation.

  this.updatedAt = moment().utc().format('YYYY-MM-DD\THH:mm:ss') + '.000Z';
};