# Reach Sequelize

  - [Introduction](#introduction)
  - [Config](#config)
  - [Model](#model)

## [Introduction](#introduction)

Provides reach models with the ability to utilize the sequelize SQL ORM with support for PostgreSQL, MySQL, SQLite and MSSQL.

## [Config](#config)

Default configuration file:

```js
module.exports = {

  /*
   |--------------------------------------------------------------------------------
   | Sequelize
   |--------------------------------------------------------------------------------
   |
   | host     : Server address
   | database : Name of the database to connect to
   | username : The username to use for the connection
   | password : The password to use for the connection
   | dialect  : mysql | mariadb | sqlite | postgres | mssql
   | pool     : Connection pool settings
   |   max  : Max number of active pools 
   |   min  : Min number of pools
   |   idle : Idle setting
   | debug  : Log sequelize output to the terminal
   | force  : Drop all the tables when syncing tables
   | _super : The system batch user use when there is no authorized actor
   |
   */

  sequelize : {
    host     : 'localhost',
    database : null,
    username : null,
    password : null,
    dialect  : 'mysql',
    pool     : {
      max  : 5,
      min  : 0,
      idle : 10000
    },
    debug  : false,
    force  : false,
    _super : {
      role      : 'admin',
      firstName : 'John',
      lastName  : 'Doe',
      email     : 'admin@batch.none',
      password  : 'password'
    }
  }

};
```

## [Model](#model)

Here is a sample model with all available parameters using sequelize:

```js
Reach.Register.Model('Foo', 'sequelize', function (model, Sequelize) {
  
  /**
   * The identity of the table created in your database.
   * @property table
   * @type     String
   */
  model.table = 'foos';

  /**
   * The sequelize schema definition of your model.
   * <http://docs.sequelizejs.com/en/latest/docs/models-definition/>
   * @property schema
   * @type     Object
   */
  model.schema = {
    barId : { 
      type       : Sequelize.INTEGER,
      references : {
        model : 'bars',
        key   : 'id'
      }
    }
  };

  /**
   * The relation definitions of your model.
   * <http://docs.sequelizejs.com/en/latest/docs/associations/>
   * @property relations
   * @type     Array
   */
  model.relations = ['Bar', function (Bar) {
    this.hasOne(Bar, { as : 'bar', foreignKey : 'barId' });
  }];

  /**
   * If set to false, records will be physicaly removed on delete operations.
   * @property paranoid
   * @type     Boolean
   * @default  true
   */
  model.paranoid = false;

  /**
   * Attributes that can be provided that is not part of the model schema.
   * @property attributes
   * @type     Array
   */
  model.attributes = [ 'location' ];

  /**
   * Attributes to remove before returning the model as JSON.
   * @property blacklist
   * @type     Array
   */
  model.blacklist = [ 'deletedAt' ];

  return model;

});
```