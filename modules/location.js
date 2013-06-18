module.exports = {
  create: create,
  link: link
};

function create(app) {
  // define models
  var RentalLocation = app.model('location', {
    address: String,
    zip: Number,
    city: String,
    state: String,
    name: String
  });

  return RentalLocation;
}

function link(RentalLocation, modules) {
  // attach to the db DataSource
  RentalLocation.dataSource('db');

  // relationships
  RentalLocation.hasMany(modules.weapon);
}
