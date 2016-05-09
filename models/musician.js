var db = require('../config').db;
var Sequelize = require('sequelize');

var Musician = db.define('musician', {
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name'
    },
    picture: {
      type: Sequelize.STRING,
      field: 'picture'
    },
    bio: {
      type: Sequelize.STRING,
      field: 'bio'
    }
  },
  {
    timestamps: false
  });

module.exports = Musician;
