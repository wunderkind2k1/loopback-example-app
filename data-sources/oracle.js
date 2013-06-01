/**
 * Dependencies
 */

var asteroid = require('asteroid');

// export the oracle data source
module.exports = asteroid.createDataSource({
  adapter: 'oracle',
  host: '166.78.158.45',
  database: 'XE',
  username: 'strongloop',
  password: 'str0ng100pjs',
  debug: false
});

var Location = require('../models/location');