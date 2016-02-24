'use strict';

let changeCase = Bento.ChangeCase;

/**
 * Performs a relational request on a single model.
 * @param {Array} relations
 */
module.exports = function *(relations) {
  for (let i = 0, len = relations.length; i < len; i++) {
    let options = relations[i];
    let Model   = Bento.model(options.model);
    let query   = options.where;

    // ### Query
    // If query is not defined we use the related primary key as the identifier against
    // the related model.

    if (!query) {
      query = {
        [this._relatedPK] : this.id
      };
    }

    // ### Attribute
    // Add the relation to the attribute list of the model so that it gets transfered
    // with the toJSON response.

    this._attributes.push(options.as);

    // ### Assign
    // Perform the query operation and assign it to the model.

    let result = null;
    switch (options.relation) {
      case 'hasOne' : {
        result = yield Model.findOne({
          where : query
        });
        break;
      }
      case 'hasMany' : {
        result = yield Model.find({
          where : query
        });
        break;
      }
    }

    this[options.as] = result;
  }
};
