/**
 * Dependencies
 */

var asteroid = require('asteroid');

module.exports = function () {
  var ds = null;

  if(process.env.NODE_ENV === 'test') {
    // use memory adapter
    ds = asteroid.createDataSource({
      connector: require('asteroid').Memory
    });
  } else {
    // export the oracle data source
    ds = asteroid.createDataSource({
      connector: require('jugglingdb-oracle'),
      host: '166.78.158.45',
      database: 'XE',
      username: 'blackpool',
      password: 'str0ng100pjs',
      debug: false
    });
  }

  return ds;
};
