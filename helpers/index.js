'use strict';

/**
 * @class Helpers
 */
let Helpers = module.exports = {};

/**
 * @method prepareWhere
 * @param  {Object} query
 * @param  {Object} options
 * @return {Object}
 */
Helpers.prepareWhere = function (query, options) {
  let result = {};
  for (let key in options) {
    if (query.hasOwnProperty(key)) {
      result[key] = prepareOptions(query[key], options[key]);
    }
  }
  return result;
};

/**
 * @private
 * @method prepareOptions
 * @param  {String} value
 * @param  {Mixed}  options
 * @return {Object}
 */
function prepareOptions(value, options) {
  if ('object' !== typeof options) {
    if ('string' === typeof options) {
      return options.replace('?', value);
    }
    return options;
  }
  let result = {};
  if (Object === options.constructor) {
    for (let key in options) {
      result[key] = prepareOptions(value, options[key]);
    }
  }
  return result;
}