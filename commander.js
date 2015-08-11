'use strict';

let mysql  = require('mysql');
let config = Reach.config.sequelize;
let host   = mysql.createConnection({
  host     : config.host,
  database : config.database,
  user     : config.username,
  password : config.password
});

module.exports = function *(command) {
  return yield new Promise(function (resolve, reject) {
    host.query(command, function (err, res) {
      if (err) { return reject(err); }
      resolve(res);
    });
  });
};