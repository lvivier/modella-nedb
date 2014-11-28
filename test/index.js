
var Cursor = require('nedb/lib/cursor')
var Datastore = require('nedb')
var assert = require('assert')
var model = require('modella')
var nedb = require('..')

/**
 * Database path
 */

var USER_PATH = __dirname + '/user.db'


/**
 * User model
 */

var User = model('User')
  .attr('_id')
  .attr('name', {type:String})
  .attr('email', {unique:true})
  .attr('createdAt', {type:Date})
  .use(nedb(USER_PATH))


/**
 * Fixture
 */

var obj = {
  name: 'Elvis',
  email: 'elvis@derp.ie',
  createdAt: new Date()
}

var user = new User(obj)


/**
 * Tests
 */

suite('Interface')

test('Sync layer methods exist', function(){
  assert('function' === typeof User.save)
  assert('function' === typeof User.update)
  assert('function' === typeof User.remove)
})

test('Datastore exposed at Model.db', function(){
  assert(User.db instanceof Datastore)
})

test('Can BYO Datastore', function(){
  var db = new Datastore()
  var plugin = nedb(db)
  var Fixture = model('Fixture')

  plugin(Fixture)
  assert(db === Fixture.db)
})

suite('Model.save')

test('Saves a model', function(done){
  user.save(done)
})

test('Respects unique index', function(done){
  var user2 = new User({name:'Jerry', email:'elvis@derp.ie'})
  user2.save(function(err){
    assert.equal('uniqueViolated', err.errorType)
    assert.equal('elvis@derp.ie', err.key)
    done()
  })
})

suite('Model.update')

test('Updates a document', function(done){
  user.name('Ronald')
  user.save(done)
})

test('No changes made', function(done){
  user.save(done)
})

suite('Model.find')

test('Aliased to Model.get', function(){
  assert.equal(User.get, User.find)
})

test('Finds one by id', function(done){
  User.find(user.primary(), function(err, user){
    assert(user instanceof User)
    assert.equal('Ronald', user.name())
    assert.equal('elvis@derp.ie', user.email())
    done(err)
  })
})

test('Finds one by query', function(done){
  User.find({name:'Ronald'}, function(err, user){
    assert(user instanceof User)
    done(err)
  })
})

suite('Model.all')

test('Aliased to Model.query', function(){
  assert.equal(User.all, User.query)
})

test('Finds documents by query', function(done){
  User.all({name:'Ronald'}, function(err, arr){
    assert.equal(1, arr.length)
    assert(arr[0] instanceof User)
    done(err)
  })
})

test('Returns a cursor', function(){
  var cur = User.query({})
  assert(cur instanceof Cursor)
})

test('Cursor gives array of model instances', function(done){
  User.query({name:'Ronald'}).exec(function(err, arr){
    assert(Array.isArray(arr))
    assert.equal(1, arr.length)
    assert(arr[0] instanceof User)
    done(err)
  })
})

suite('Model.count')

test('Counts by query', function(done){
  User.count({name:'Ronald'}, function(err, num){
    assert.equal(1, num)
    done(err)
  })
})

suite('Model.remove')

test('Removes a model', function(done){
  user.remove(done)
})
