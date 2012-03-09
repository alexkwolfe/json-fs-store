var async = require('async'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('node-uuid');
    
module.exports = function(dir) {
  dir = dir || path.join(process.cwd(), 'store');
  
  return {

    // store in this directory
    
    dir: dir,
    
    // list all stored objects by reading the file system
    
    list: function(cb) {
      var self = this;
      readdir(dir, function(err, files) {
        if (err) return cb(err);
        files = files.filter(function(f) { return f.substr(-5) === ".json"; });
        var fileLoaders = files.map(function(f) {
          return function(cb) {
            loadFile(f, cb);
          };
        });
        async.parallel(fileLoaders, function(err, objs) {
          if (err) return cb(err);
          sort(objs, cb);
        });
      });
    },
    
    
    // store an object to file
    
    save: function(obj, cb) {
      var json;
      try {
        json = JSON.stringify(obj, null, 2);
      }
      catch (e) {
        return cb(e);
      }
      obj.id = obj.id || uuid.v4();
      fs.writeFile(path.join(dir, obj.id + '.json'), json, 'utf8', function(err) {
        if (err) return cb(err);
        cb();
      });
    },
    
    
    // delete an object's file
    
    remove: function(obj, cb) {
      fs.unlink(path.join(dir, obj.id + '.json'), function(err) {
        cb(err);
      })
    },
    
    
    // load an object from file
    
    load: function(id, cb) {
      loadFile(path.join(dir, id + '.json'), cb);
    }
    
  }
};

var readdir = function(dir, cb) {
  fs.readdir(dir, function(err, files) {
    if (err) return cb(err);
    files = files.map(function(f) {
      return path.join(dir, f);
    });
    cb(null, files);
  });
};

    
var loadFile = function(f, cb) {
  fs.readFile(f, 'utf8', function(err, code) {
    if (err) return cb(err);
    try {
      cb(null, JSON.parse(code));
    }
    catch (e) {
      cb(e);
    }
  });
};
    
var sort = function(objs, cb) {
  async.sortBy(objs, function(obj, cb) {
    cb(null, obj.name || '');
  }, cb);
};