var db = require('../config').db;
var Sequelize = require('sequelize');

var Auth = db.define('auth', {
    username: {
      type: Sequelize.STRING,
      field: 'username'
    },
    hash: {
      type: Sequelize.STRING,
      field: 'hash'
    },
    musicianId: {
      type: Sequelize.INTEGER,
      field: 'musician_id'
    },
    isAdmin: {
      type: Sequelize.INTEGER,
      field: 'is_admin'
    }
  },
  {
    timestamps: false,
    tableName: 'auth'
  });

module.exports = Auth;
