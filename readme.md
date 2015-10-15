This Node.js npm module simply serializes JavaScript objects to JSON files into the file system directory of your choosing.

[![Build Status](https://travis-ci.org/alexkwolfe/json-fs-store.svg?branch=master)](https://travis-ci.org/alexkwolfe/json-fs-store)

### Creating a store

The store module is a function that takes a single parameter: the path to the location on the file system where you want to store your objects. If you omit the storage location the 'store' directory in your current working directory will be used.

```javascript
var store = require('json-fs-store')('/path/to/storage/location');
```

### Adding an object

A stored object must have an `id` attribute (one will be provided if it does not). The object
will be serialized to JSON using `JSON.stringify` and written to the storage location. 

To customize the JSON, you can define the `#toJSON` function on the object to be stored. That function
must return a JavaScript object.

```javascript
var donkey = {
  id: '12345',
  name: 'samuel',
  color: 'brown'
};

store.add(donkey, function(err) {
  // called when the file has been written
  // to the /path/to/storeage/location/12345.json
  if (err) throw err; // err if the save failed
});
```

### Retrieving an object

To retrieve an object, you must know its `id` attribute and use it as a parameter for the `load` function.

```javascript
store.load('12345', function(err, loaded_donkey){
  if(err) throw err; // err if JSON parsing failed

  // do something with loaded_donkey here

});
```

### Listing stored objects

Every call to the `#list` function reads the file system and returns the objects stored in the directory you specified when you created your store.
Objects will be sorted according to their `name` attribute, if defined.

```javascript
store.list(function(err, objects) {
  // err if there was trouble reading the file system
  if (err) throw err;
  // objects is an array of JS objects sorted by name, one per JSON file
  console.log(objects);
});
```

### Removing stored objects

A stored object may be removed simply by passing the object to the `#remove` function.
The object's `id` attribute will be used to remove the object's file from the file system.

```javascript
store.remove(donkey, function(err) {
  // called after the file has been removed
  if (err) throw err; // err if the file removal failed
});
```

# FIN.
