var asteroid = require('asteroid');
var properties = require('./properties');
var config = require('./config');
var Weapon = asteroid.createModel('weapon', properties, config);
var dataSource = require('../' + config['data-source']);

Weapon.attachTo(dataSource);

if (config.public) {
  global.app.model(Weapon);
}

if(process.env.NODE_ENV === 'test') {
  console.log('-----TEST-----');

  // import data
  require('../../test-data/import')(Weapon);
}

module.exports = Weapon;
