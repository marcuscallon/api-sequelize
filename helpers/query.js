'use strict';

let type = Bento.Helpers.Type;

// ### Query

let Query = module.exports = function query(options, schema) {
  let result = { where : {} };
  let where  = schema.where;
  for (let key in where) {
    if (options.hasOwnProperty(key)) {
      result.where[key] = prepareValue(where[key], options[key]);
    }
  }
  if (schema.include) { result.include = schema.include; }
  if (options.limit)  { result.limit   = Query.NUMBER(options.limit); }
  if (options.offset) { result.offset  = Query.NUMBER(options.offset); }
  return result;
};

/**
 * @method BOOLEAN
 * @param  {Mixed} val
 * @return {Boolean}
 */
Query.BOOLEAN = function BOOLEAN(val) {
  switch (val) {
    case 'true'  : case 1 : return true;
    case 'false' : case 0 : return false;
    default :
      return val;
  }
};

/**
 * @method STRING
 * @param  {Mixed} val
 * @return {String}
 */
Query.STRING = function STRING(val) {
  return String(val);
};

/**
 * @method NUMBER
 * @param  {Mixed} val
 * @return {Number}
 */
Query.NUMBER = function NUMBER(val) {
  return Number(val);
};

/**
 * @method DATE
 * @param  {Mixed} val
 * @return {Date}
 */
Query.DATE = function DATE(val) {
  return Date(val);
};

/**
 * @param  {Mixed} handler
 * @param  {Mixed} val
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
