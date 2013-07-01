var app = require('./app');
// HACK
var swagger = require('asteroid/node_modules/sl-remoting/ext/swagger');
var repl = require('repl').start({}).context;

repl.app = app;
repl.test = test;

function test() {
  var models = app.models().map(modelToJsonSchema);

  // TODO(schoon) - This won't work before the first request?
  // TODO(schoon) - The remote exports get wiped out every request.
  setInterval(function () {
    var remotes = app.remotes();

    console.log('Installing.');
    remotes.exports.swagger = swagger(remotes);

    remotes.exports.foo = {
      bar: bar
    };
    function bar(callback) {
      callback(null, 'foobar!');
    }
    bar.shared = true;
    bar.shared.accepts = [];
    bar.shared.returns = [{ arg: 'data', type: 'string' }];
  }, 1000);

  // TODO: Add to swagger docs.
  // TODO: Implement for return types.
  // TODO: Implement for parameters.
}

function modelToJsonSchema(model) {
  var name = model.modelName;
  var props = model.properties;
  var schema = {};

  schema.id = name; // TODO: Capitalize.
  schema.properties = {};

  Object.keys(props).forEach(function (key) {
    schema.properties[key] = convertProperty(props[key]);
  });

  return schema;
}

function convertProperty(prop) {
  return {
    type: convertType(prop.type),
    required: prop.required
  };
}

function convertType(type) {
  switch (type) {
    case Buffer:
      return 'byte';
    case Boolean:
      return 'boolean';
    case Number:
      return 'double';
    case String:
      return 'string';
    case Date:
      return 'date';
  }
}
