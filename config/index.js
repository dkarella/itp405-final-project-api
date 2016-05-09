var Sequelize = require('sequelize');

var db = {};

var db = new Sequelize('daniel_arellano', 'daniel_arellano', 'eloquentORM2016', {
  host: 'itp460.usc.edu',
  dialect: 'mysql'
});

module.exports = {
  secret: 'secretivesecret',
  db: db
};
