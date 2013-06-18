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

// HACK
global.app = app;

// expose a rest api
app.use(asteroid.rest());

function loadModules(callback) {
  var modules = {};
  var rootpath = path.resolve(__dirname, 'modules');

  fs
    .readdirSync(rootpath)
    .map(function (fragment) {
      var fullpath = path.join(rootpath, fragment);
      var name = fragment.slice(0, fragment.length - path.extname(fragment).length);

      modules[name] = require(fullpath);
    });
}

loadModules();

// start the server
app.listen(3000);
