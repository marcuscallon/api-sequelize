module.exports = {

  /*
   |--------------------------------------------------------------------------------
   | Sequelize
   |--------------------------------------------------------------------------------
   |
   | @param {String}  host     Server address
   | @param {Number}  port     Server port
   | @param {String}  database Name of the database to connect to
   | @param {String}  username Connection username
   | @param {String}  password Connection password
   | @param {String}  dialect  mysql | mariadb | sqlite | postgres | mssql
   | @param {Object}  pool     Connection pool settings
   | @param {Boolean} debug    Log sequelize output to the terminal
   | @param {Boolean} force    Drop all the table when syncing
   |
   */

  sequelize : {
    host     : 'localhost',
    port     : 3306,
    database : 'bento',
    username : 'root',
    password : null,
    dialect  : 'mysql',
    pool     : {
      max  : 10,
      min  : 0,
      idle : 1000
    },
    debug : false,
    force : false
  }

};
