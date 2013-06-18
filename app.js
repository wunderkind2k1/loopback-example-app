/**
 * App Dependencies.
 */

var asteroid = require('asteroid')
  , async = require('async')
  , app = module.exports = asteroid()
  , fs = require('fs')
  , path = require('path')
  , request = require('request')
  , TaskEmitter = require('sl-task-emitter');

// expose a rest api
app.use(asteroid.rest());

function loadModules(callback) {
  var modules = {};
  var rootpath = path.resolve(__dirname, 'modules');

  async.waterfall([
    function (_callback) {
      fs.readdir(rootpath, _callback);
    },
    function (fragments, _callback) {
      async.map(fragments, function (fragment, __callback) {
        var fullpath = path.join(rootpath, fragment);
        var mod = require(fullpath);
        var name = fragment.slice(0, fragment.length - path.extname(fragment).length);
        var create = (mod && mod.create) || mod;

        if (typeof create !== 'function') {
          return __callback(null, null);
        }

        create(function (err, result) {
          modules[name] = result;
          __callback(null, [mod, result]);
        });
      }, _callback);
    },
    function (results, _callback) {
      async.each(results, function (arr, __callback) {
        if (!arr) {
          return __callback();
        }

        var mod = arr[0];
        var result = arr[1];

        if (mod && typeof mod.link === 'function') {
          mod.link(result, app, modules, __callback);
        } else {
          __callback();
        }
      }, _callback);
    }
  ], callback);
}

loadModules(function (err, modules) {
  // start the server
  app.listen(3000);
});
