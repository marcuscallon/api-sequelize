'use strict';

let loaded = [];

module.exports = function *() {
  let models = Object.keys(Bento.store.models);
  for (let i = 0, len = models.length; i < len; i++) {
    if (loaded.indexOf(models[i]) !== -1) {
      continue;
    }
    let model = Bento.model(models[i]);
    if (model._relations) {
      prepareRelations(model, model._relations);
    }
    loaded.push(models[i]);
  }
}

/**
 * @private
 * @method prepareRelations
 * @param  {Function} model
 * @param  {Array}    relations
 */
function prepareRelations(model, relations) {
  let handler = relations.pop();
  relations.forEach(function (target, index) {
    relations[index] = Bento.model(target)._schema;
  });
  handler.apply(model._schema, relations);
}