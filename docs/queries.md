# Queries

[Back to Index](index.md)

## [Find](#find)

**yield Model.find(query, [ BOOLEAN runFilter ])**

Return records based on the provided query parameters:

```js
let result = yield Model.find({
  where : {
    foo : 'bar'
  },
  limit  : 0,
  offset : 0,
  order  : [
    [ 'key', 'ASC' ]
  ]
});
```

Return records based on the provided front end query and run it through the models filter:

```js
let result = yield Model.find({
  foo    : 'bar',
  limit  : 0,
  offset : 0,
  order  : 'key,ASC;key,DESC',
}, true);
```

Returns records based on the provided front end query and run it through the models filter and its search definition:

```js
let result = yield Model.find({
  search : 'b%',
  limit  : 0,
  offset : 0,
  order  : 'key,ASC;key,DESC'
}, true);
```

## [FindOne](#find-one)

**yield Model.findOne(query, [ BOOLEAN runFilter ])**

Return a record based on the provided query parameters:

```js
let result = yield Model.findOne({
  where : {
    foo : 'bar'
  }
});
```

Return a record based on the provided front end query and run it through the models filter:

```js
let result = yield Model.findOne({
  foo : 'bar'
}, true);
```

Returns a record based on the provided front end query and run it through the models filter and its search definition:

```js
let result = yield Model.findOne({
  search : 'b%'
}, true);
```

## [FindById](#find-by-id)

**yield Model.findById(id)**

```js
let model = yield Model.findById(id);
```

## [Update](#update)

**yield model.update(data)**

```js
let model = yield Model.findById(1);
yield model.update({
  foo : 'fooBar'
});
```

## [Delete](#delete)

**yield model.delete([ primaryKey ])**

```js
let model = yield Model.findById(1);
yield model.delete();
```

[Back to Index](index.md)
