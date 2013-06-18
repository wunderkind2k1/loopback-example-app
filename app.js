/**
 * App Dependencies.
 */

var asteroid = require('asteroid')
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

  fs.readdir(rootpath, function (err, fragments) {
    fragments.map(function (fragment) {
      var fullpath = path.join(rootpath, fragment);
      var mod = require(fullpath);
      var result;

      if (typeof mod === 'function') {
        result = mod();
      } else if (mod && typeof mod.create === 'function') {
        result = mod.create();
      }

      fragment = fragment.slice(0, fragment.length - path.extname(fragment).length);
      modules[fragment] = result;
      return [mod, result];
    }).forEach(function (arr) {
      var mod = arr[0];
      var result = arr[1];
      if (mod && typeof mod.link === 'function') {
        mod.link(result, app, modules);
      }
    });

    callback(null, modules);
  });
}

loadModules(function (err, modules) {
  // start the server
  app.listen(3000);
});
