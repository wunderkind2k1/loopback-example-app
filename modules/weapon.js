module.exports = {
  create: create,
  link: link
};

function create(app) {
  // define models
  var Weapon = app.model('weapon', {
    name: String,
    product: Number,
    audibleRange: Number,
    effectiveRange: Number,
    rounds: Number,
    extras: String,
    fireModes: String
  });

  Weapon.nearby = function (lat, long, fn) {
    // TODO ~ replace this with geo lookup
    Weapon.all(fn);
  };
  Weapon.nearby.shared = true;
  Weapon.nearby.accepts = [
    {arg: 'lat', type: 'number', required: true},
    {arg: 'long', type: 'number', required: true}
  ];

  return Weapon;
}

function link(Weapon, modules) {
  // attach to the db DataSource
  Weapon.dataSource('db');
}
