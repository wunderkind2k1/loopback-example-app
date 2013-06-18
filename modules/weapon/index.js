var asteroid = require('asteroid');
var properties = require('./properties');
var config = require('./config');

function create(callback) {
  return callback(null, asteroid.createModel('weapon', properties, config));
}

function link(Weapon, app, modules, callback) {
  Weapon.attachTo(modules[config['data-source']]);

  if (config.public) {
    app.model(Weapon);
  }

  if(process.env.NODE_ENV === 'test') {
    console.log('-----TEST-----');

    // import data
    require('../../test-data/import')(Weapon);
  }

  callback(null);
}

module.exports = {
  create: create,
  link: link
};
