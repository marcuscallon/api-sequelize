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
   * A list of custom model methods.
   * @type {Object}
   */
  model.methods = {};

  return model;

});
```

#### [Table][#table]

Defines the name of the table that is created for the model.

 - As of *1.1.5* table name defaults to the models name, so if you define `Foo` as name the default name will be `foos`.

#### [Schema][#schema]

Defines the models schema, for a full overview over how to define your schema see the [sequelize docs](http://docs.sequelizejs.com/en/latest/docs/models-definition/).

#### [Attributes](#attributes)

A model might sometimes get assigned custom attributes to it outside of its default schematics. In our current implementation the `.toJSON()` method by default uses the automatic attributes defined in the schema to define which values are to be returned in the object. So to allow custom attributes to be delivered with the `.toJSON()` method we need to assign the possible attributes to the model.

 - Basic: `[ 'bar', 'fooBar' ]`
 - Sorting: `[ 'bar=>id', 'fooBar=>bar' ]`

If you wish to assign a `key` to appear in a specific part of the returned JSON you can use the `=>` to define where its to be placed. In the above case we want `bar` to come after `id`, and `fooBar` to come after `bar`.

#### [Blacklist](#blacklist)

The blacklist is an array of values we do not want the `.toJSON()` method to include in its construction, this is valuable for when we want to hide properties that should only be available within the system and not delivered to a client.

#### [Methods](#methods)

These are custom methods that you can define on your model where the `this` reffers to a model instance.

[Back to Index](index.md) - [Next [ Queries ]](queries.md)
