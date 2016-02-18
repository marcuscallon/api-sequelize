# Models

[Back to Index](index.md)

 - [Schema](#schema)

## [Schema](#schema)

```js
Bento.Register.Model('Foo', 'sequelize', (model, Sequelize) => {

  /**
   * The identity of the table created in your database.
   * @property table
   * @type     String
   */
  model.table = 'foos';

  /**
   * The sequelize schema definition of your model.
   * @property schema
   * @type     Object
   */
  model.schema = {};

  /**
   * List of custom out of schema attributes.
   * @type {Array}
   */
  model.attributes = [];

  /**
   * A list of blacklisted public values.
   * @type {Array}
   */
  model.blacklist = [];

  /**
   * If set to false, records will be physicaly removed on delete operations.
   * @type { Boolean }
   */
  model.paranoid = false;

  /**
   * Filter user when we want to run .find and .findOne through the model through
   * a query and search filter.
   * @param  {Function} parse
   * @param  {Object}   query
   * @return {Object}
   */
  model.filter = function(parse, query) {};

  /**
   * A list of custom model methods.
   * @type {Object}
   */
  model.methods = {};

  return model;

});
```

#### [Table](#table)

Defines the name of the table that is created for the model.

 - As of *1.1.5* table name defaults to the models name, so if you define `Foo` as name the default name will be `foos`.

#### [Schema](#schema)

Defines the models schema, for a full overview over how to define your schema see the [sequelize docs](http://docs.sequelizejs.com/en/latest/docs/models-definition/).

#### [Attributes](#attributes)

A model might sometimes get assigned custom attributes to it outside of its default schematics. In our current implementation the `.toJSON()` method by default uses the automatic attributes defined in the schema to define which values are to be returned in the object. So to allow custom attributes to be delivered with the `.toJSON()` method we need to assign the possible attributes to the model.

 - Basic: `[ 'bar', 'fooBar' ]`
 - Sorting: `[ 'bar=>id', 'fooBar=>bar' ]`

If you wish to assign a `key` to appear in a specific part of the returned JSON you can use the `=>` to define where its to be placed. In the above case we want `bar` to come after `id`, and `fooBar` to come after `bar`.

#### [Blacklist](#blacklist)

The blacklist is an array of values we do not want the `.toJSON()` method to include in its construction, this is valuable for when we want to hide properties that should only be available within the system and not delivered to a client.

#### [Paranoid](#paranoid)

By default bento sequelize do not hard delete records in your database to retain certain relations and data integrity. If you define and set this value to `false` when you run the `.delete()` operation on your model it will physically remove the record from your database table.

#### [Filter](#filter)

The filter method allows you to define how `.find()` or `.findOne()` deals with incoming query requests. It's designed so that we can define what fields we wish to allow to query on as well as how to process each fields type.

To setup the filter add the following method to your model:

```js
model.filter = function(parse, query) {
  return parse(query, {
    where : {
      userId  : parse.NUMBER,
      groupId : parse.NUMBER
    }
  }, {
    where : {
      $or : [
        { bar : { $like : `${ query.search }` } }
      ]
    }
  });
};
```

The method provides you with `parse` which is the parse method used to filter your query, and the `query` which is the raw data coming in from a front end request. The `parse` method takes the `query` and two objects. The first object is passed through first and is meant for all your standard filters, the second is your search schematics and is designed for when the query contains a `search` key.

#### [Methods](#methods)

These are custom methods that you can define on your model where the `this` reffers to a model instance.

[Back to Index](index.md) - [Next [ Queries ]](queries.md)
