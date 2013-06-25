/**
 * App Dependencies.
 */

var async = require('async')
  , fs = require('fs')
  , path = require('path')
  , request = require('request')
  , TaskEmitter = require('sl-task-emitter');

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
