module.exports = {
  create: create
};

function create(app) {
  // define a data source
  return app.dataSource('db', {adapter: 'memory'});
}
