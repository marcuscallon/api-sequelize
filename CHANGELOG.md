# Changelog

## 1.1.7

 - Added default values to sequelize configuration for database and user.

## 1.1.6

 - Removed old role setup from bootstrap

## 1.1.5

 - Added `.max(field, options)` to model, which returns the max value of a field.
 - Added `.min(field, options)` to model, which returns the min value of a field.
 - Added `.sum(field, options)` to model, which returns the sum of a field.
 - Edit `model.table` field is now optional, will now plurralize the model name as default.
 - Edit `.save()` method on model to return itself.
 - Edit `.update(data)` method on model to return itself.
 - Edit `.relay(type, [resource], [user])` => `.relay(type, [resource], [options])`, to support core group features.

#### .relay(type, [resource], [options]) example

```js
model.relay('update', 'foos', {
  to      : 'user', // user, group, admin
  userId  : 1,      // only needed when emitting to user
  groupId : 1       // required for group, and admin. Optional for user.
                    // when provided for user it will emit to admin channel
                    // for that group.
});
```
