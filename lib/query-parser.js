'use strict';

let error      = Bento.Error;
let changeCase = Bento.ChangeCase;
let type       = Bento.Type;

// ### Query

let Query = module.exports = function query(query, schema, search) {
  let result = {
    where : {}
  };

  // ### Prepare Where
  // Loops through the schema and picks out the relevant values in the
  // provided query object.

  for (let key in schema.where) {
    if (query.hasOwnProperty(key)) {
      result.where[key] = prepareValue(schema.where[key], query[key]);
    }
  }

  // ### Search
  // If a search request is made and a search schema is provided we
  // prepare the search and add it to the request.

  if (query.search && search) {
    for (let key in search.where) {
      result.where[key] = search.where[key];
    }
  }

  // ### Limit
  // Set the query limit for the request.

  if (query.limit) {
    result.limit = parseInt(query.limit);
  }

  // ### Offset
  // Set the query offset for the request.

  if (query.offset) {
    result.offset = parseInt(query.offset);
  }

  // ### Order
  // Set the order of the request.

  if (query.order) {
    result.order = query.order.split(';').map(val => {
      val = val.split(',');
      val[0] = changeCase.toSnake(val[0]);
      return val;
    });
  }

  return result;
};

/**
 * Returns value as boolean true|false.
 * @param  {Mixed} val
 * @return {Boolean}
 */
Query.BOOLEAN = type.getBoolean;

/**
 * Returns value as string.
 * @param  {String} val
 * @return {String}
 */
Query.STRING = function STRING(val) {
  return String(val);
};

/**
 * Returns value as number.
 * @param  {String} val
 * @return {Number}
 */
Query.NUMBER = function NUMBER(val) {
  return Number(val);
};

/**
 * Returns value as date.
 * @param  {String} val
 * @return {Date}
 */
Query.DATE = function DATE(val) {
  return Date(val);
};

// ### SEQUELIZE OPERATORS

/**
 * @param  {String} val
 * @return {Object}
 */
Query.GT = function GT(val) {
  return {
    $gt : Number(val)
  };
};


/**
 * @param  {String} val
 * @return {Object}
 */
Query.GTE = function GTE(val) {
  return {
    $gte : Number(val)
  };
};

/**
 * @param  {String} val
 * @return {Object}
 */
Query.LT = function LT(val) {
  return {
    $lt : Number(val)
  };
};

/**
 * @param  {String} val
 * @return {Object}
 */
Query.LTE = function LTE(val) {
  return {
    $lte : Number(val)
  };
};

/**
 * @param  {String} val
 * @return {Object}
 */
Query.NE = function NE(val) {
  return {
    $ne : Number(val)
  };
};

/**
 * @param  {String} val Comma seperated array string.
 * @return {Object}
 */
Query.BETWEEN = function BETWEEN(val) {
  return {
    $between : val.split(',')
  };
};

/**
 * @param  {String} val Comma seperated array string.
 * @return {Object}
 */
Query.NOT_BETWEEN = function NOT_BETWEEN(val) {
  return {
    $notBetween : val.split(',')
  };
};

/**
 * @param  {String} val Comma seperated array string.
 * @return {Object}
 */
Query.IN = function IN(val) {
  return {
    $in : val.split(',')
  };
};

/**
 * @param  {String} val Comma seperated array string.
 * @return {Object}
 */
Query.NOT_IN = function NOT_IN(val) {
  return {
    $notIn : val.split(',')
  };
};

/**
 * @param  {String} val
 * @return {Object}
 */
Query.LIKE = function LIKE(val) {
  return {
    $like : val
  };
};

/**
 * @param  {String} val
 * @return {Object}
 */
Query.NOT_LIKE = function NOT_LIKE(val) {
  return {
    $notLike : val
  };
};

/**
 * @param  {Mixed} handler
 * @param  {String} val
 * @return {Object}
 */
function prepareValue(handler, val) {
  if (type.isFunction(handler)) {
    return handler(val);
  }
  let result = {};
  for (let key in handler) {
    result[key] = prepareValue(handler[key], val);
  }
  return result;
};
