var Sequelize = require('sequelize');

var db = new Sequelize('MusicMatch', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});


module.exports = {
  secret: 'secretivesecret',
  db: db
};
