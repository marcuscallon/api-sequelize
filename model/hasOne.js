'use strict';

let parseRelation = require('../lib/relations');

/**
 * Performs a hasOne relational request on a single model.
 * @param {Array} relations
 */
module.exports = function *(relations) {
  if (Array.isArray(relations)) {
    let list = [];
    for (let i = 0, len = relations.length; i < len; i++) {
      list.push(parseRelation.call(this, 'hasOne', relations[i]));
    }
    yield this.with(list);
  } else {
    yield this.with([ parseRelation.call(this, 'hasOne', relations) ]);
  }
};
