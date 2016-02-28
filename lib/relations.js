'use strict';

module.exports = function(relation, target, isMany) {
  let model     = null;
  let attribute = null;
  let query     = null;

  // ### Attribute
  // The attribute to assign the related data to.

  if (target.match(/=>/)) {
    let data  = target.split('=>');
    target    = data[0];
    attribute = data[1];
  }

  // ### Query
  // Supporting simple string query against target model.

  if (target.match(/\?/)) {
    let data = target.split('?');
    model    = data[0];
    query    = data[1].split('&').reduce((qs, next) => {
      let pair = next.split('=');
      qs[pair[0]] = isMany ? pair[1] : this[pair[1]];
      return qs;
    }, {});
  } else {
    model = target;
  }

  return {
    relation : relation,
    model    : model,
    as       : attribute,
    where    : query
  };
};
