module.exports = {
  
  /*
    Sequelize

    @host     {String}  Server address
    @database {String}  Name of the database to connect to
    @username {String}  Connection username
    @password {String}  Connection password
    @dialect  {String}  mysql | mariadb | sqlite | postgres | mssql
    @pool     {Object}  Connection pool settings
    @debug    {Boolean} Log sequelize output to the terminal
    @force    {Boolean} Drop all the table when syncing
   */

  sequelize : {
    host     : 'localhost',
    database : null,
    username : null,
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