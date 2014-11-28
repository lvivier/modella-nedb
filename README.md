
# modella-nedb

[NeDB][ne] persistence for modella.

NeDB is a tiny embedded database, written in JavaScript, with a
MongoDB-like API. It's ideal for prototyping, microservices, and
desktop/CLI applications, and has a human-readable file format.


## Install

    $ npm install modella-nedb


## Example

```js
var nedb = require('modella-nedb')('./user.db')
var model = require('modella')

var User = model('User')
  .attr('_id')
  .attr('name')
  .attr('email', {unique:true})
  .attr('age')

User.use(nedb)

// query
User
  .query({age:{$gt:10}})
  .sort({age:-1})
  .exec(function(err, users){
    // users is an array of User instances
  })
```


## API

### plugin(opts)

Call the module function with `opts` to return a plugin. `opts` can be
an object, a string file path, or an NeDB `Datastore` instance. Valid
options are [described in the NeDB docs](doc).

Called without any options, the datastore will be in-memory, with no
persistence.

```js
var plugin = require('modella-nedb')
// all legit
plugin('./user.db')
plugin({filename:'./user.db'})
plugin(new Datastore('./user.db'))
```

### Model#save(cb)

Saves a model's properties to disk and calls `cb`.

### Model#remove(cb)

Removes a model from the db.

### Model.find(query, cb)

Aliased to `Model.get`. Finds a single model using `query`.

### Model.all(query[, cb])

Aliased to `Model.query`. Finds models using `query`, calls `cb` or returns a Cursor (see below).

### Model.removeAll(query, cb)

Remove models matching `query` and calls `cb`.

### Model.index(opts[, cb])

Set an index on the datastore. Options are:

- **fieldName** Name of the field to index
- **unique** Enforce uniqueness
- **sparse** Don't index documents that don't have this field

You can also specify indexes in the model attributes, like this:

```js
User
  .attr('age', {index:true})    // indexed
  .attr('email', {unique:true}) // unique
```

### Model.db

NeDB `Datastore` instance. Use for direct database access.

### Cursor

A call to `Model.all`/`Model.query` without a callback function
returns a `Cursor` instance. This is the same as an NeDB cursor, but
it will respond with an array of `Model` instances.

#### Cursor#sort(fields)

Sort the result set by an object of `fields` like `{email:1, age:-1}`.

#### Cursor#skip(n)

Skip `n` records in the result set.

#### Cursor#limit(n)

Limit the result set to `n` records.

#### Cursor#exec(fn)

Execute the query and call `fn` with the results.


## License

MIT

[ne]:https://github.com/louischatriot/nedb
[doc]:https://github.com/louischatriot/nedb#creatingloading-a-database
